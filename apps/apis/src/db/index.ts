import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type {
  DaoFactoryEventArgs,
  ERC20FactoryEventArgs,
  EventMetadata,
} from "../types/events.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const defaultDevDbDir = path.resolve(__dirname, "..", "..", "data");

const dbDir = process.env.DATABASE_DIR || defaultDevDbDir;
const dbFilename = process.env.DATABASE_NAME || "events.db";
const dbPath = path.join(dbDir, dbFilename);

if (!fs.existsSync(dbDir)) {
  try {
    console.warn(
      `Database directory ${dbDir} does not exist. Attempting to create it.`
    );
    fs.mkdirSync(dbDir, { recursive: true });
  } catch (err) {
    console.error(`FATAL: Failed to create database directory ${dbDir}:`, err);
    process.exit(1);
  }
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    try {
      const resolvedPath = path.resolve(dbPath);
      console.log(
        `\n\n-----> [DB SCRIPT PATH] Attempting connection to resolved path: ${resolvedPath}\n\n`
      );
      dbInstance = new Database(dbPath, { verbose: console.log });


      dbInstance.pragma("journal_mode = WAL");
      dbInstance.pragma("synchronous = NORMAL");

      dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS ERC20FactoryEvents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contractAddress TEXT NOT NULL,
          blockNumber INTEGER NOT NULL,
          blockTimestamp INTEGER NOT NULL,
          transactionHash TEXT NOT NULL,
          logIndex INTEGER NOT NULL,
          ownerAddress TEXT NOT NULL,
          tokenAddress TEXT NOT NULL,
          amount TEXT NOT NULL,
          UNIQUE(transactionHash, logIndex)
        );

        CREATE INDEX IF NOT EXISTS idx_erc20factory_contract ON ERC20FactoryEvents(contractAddress);
        CREATE INDEX IF NOT EXISTS idx_erc20factory_block ON ERC20FactoryEvents(blockNumber);
        CREATE INDEX IF NOT EXISTS idx_erc20factory_owner ON ERC20FactoryEvents(ownerAddress);
        CREATE INDEX IF NOT EXISTS idx_erc20factory_token ON ERC20FactoryEvents(tokenAddress);

        CREATE TABLE IF NOT EXISTS DAOFactoryEvents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contractAddress TEXT NOT NULL,
          blockNumber INTEGER NOT NULL,
          blockTimestamp INTEGER NOT NULL,
          transactionHash TEXT NOT NULL,
          logIndex INTEGER NOT NULL,
          daoAddress TEXT NOT NULL,
          tokenAddress TEXT NOT NULL,
          amount TEXT NOT NULL,
          UNIQUE(transactionHash, logIndex)
        );

        CREATE INDEX IF NOT EXISTS idx_daofactory_contract ON DAOFactoryEvents(contractAddress);
        CREATE INDEX IF NOT EXISTS idx_daofactory_block ON DAOFactoryEvents(blockNumber);
        CREATE INDEX IF NOT EXISTS idx_daofactory_dao ON DAOFactoryEvents(daoAddress);
        CREATE INDEX IF NOT EXISTS idx_daofactory_token ON DAOFactoryEvents(tokenAddress);
      `);
      console.log("SQLite database connected successfully.");
    } catch (error) {
      console.error(
        `FATAL: Failed to connect to SQLite database at ${dbPath}:`,
        error
      );
      process.exit(1);
    }
  }
  return dbInstance;
}

export function closeDbConnection(): void {
  if (dbInstance) {
    console.log("Closing SQLite database connection...");
    dbInstance.close();
    dbInstance = null;
    console.log("SQLite database connection closed.");
  }
}
let insertERC20Stmt: Database.Statement | null = null;
let insertDaoStmt: Database.Statement | null = null;

function prepareStatements() {
  const db = getDb();
  if (!insertERC20Stmt) {
    const sql = `
      INSERT OR IGNORE INTO ERC20FactoryEvents
        (contractAddress, blockNumber, blockTimestamp, transactionHash, logIndex, ownerAddress, tokenAddress, amount)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    insertERC20Stmt = db.prepare(sql);
  }
  if (!insertDaoStmt) {
    const sql = `
      INSERT OR IGNORE INTO DAOFactoryEvents
        (contractAddress, blockNumber, blockTimestamp, transactionHash, logIndex, daoAddress, tokenAddress, amount)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    insertDaoStmt = db.prepare(sql);
  }
}

export function insertERC20FactoryEvent(
  metadata: EventMetadata,
  args: ERC20FactoryEventArgs
) {
  prepareStatements();
  if (!insertERC20Stmt) {
    console.error("ERC20Factory insert statement not prepared!");
    return;
  }
  try {
    const info = insertERC20Stmt.run(
      metadata.contractAddress.toLowerCase(),
      metadata.blockNumber,
      metadata.blockTimestamp,
      metadata.transactionHash,
      metadata.logIndex,
      args.ownerAddress.toLowerCase(),
      args.tokenAddress.toLowerCase(),
      args.amount.toString()
    );
    if (info.changes > 0) {
      console.log(
        `Inserted ERC20FactoryEvent from tx ${metadata.transactionHash}, log ${metadata.logIndex}`
      );
    } else {
      console.log(
        `Skipped duplicate ERC20FactoryEvent from tx ${metadata.transactionHash}, log ${metadata.logIndex}`
      );
    }
  } catch (error) {
    console.error(
      `Failed to insert ERC20FactoryEvent (tx: ${metadata.transactionHash}):`,
      error
    );
  }
}

export function insertDaoFactoryEvent(
  metadata: EventMetadata,
  args: DaoFactoryEventArgs
) {
  prepareStatements();
  if (!insertDaoStmt) {
    console.error("DAOFactory insert statement not prepared!");
    return;
  }
  try {
    const info = insertDaoStmt.run(
      metadata.contractAddress.toLowerCase(),
      metadata.blockNumber,
      metadata.blockTimestamp,
      metadata.transactionHash,
      metadata.logIndex,
      args.daoAddress.toLowerCase(),
      args.tokenAddress.toLowerCase(),
      args.amount.toString()
    );
    if (info.changes > 0) {
      console.log(
        `Inserted DAOFactoryEvent from tx ${metadata.transactionHash}, log ${metadata.logIndex}`
      );
    } else {
      console.log(
        `Skipped duplicate DAOFactoryEvent from tx ${metadata.transactionHash}, log ${metadata.logIndex}`
      );
    }
  } catch (error) {
    console.error(
      `Failed to insert DAOFactoryEvent (tx: ${metadata.transactionHash}):`,
      error
    );
  }
}
