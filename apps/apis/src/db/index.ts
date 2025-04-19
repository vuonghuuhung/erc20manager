import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import fs from "fs";
import type {
  EventMetadata,
  ERC20FactoryEventArgs,
  DaoFactoryEventArgs,
} from "../types/events";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const defaultDevDbDir = path.resolve(__dirname, "..", "..", "data");

const dbDir = process.env.DATABASE_DIR || defaultDevDbDir;
const dbFilename = "events.db";
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
      console.log("SQLite database connected successfully.");

      dbInstance.pragma("journal_mode = WAL");
      dbInstance.pragma("synchronous = NORMAL");
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
