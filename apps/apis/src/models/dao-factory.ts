import { getDb } from "../db/index.js";
import { DaoFactoryCreateEventArgs, EventMetadata } from "../types/events.js";

export const insertNewDao = async (
    metadata: EventMetadata,
    args: DaoFactoryCreateEventArgs
) => {
    const db = getDb();

    const sql = `
      INSERT OR IGNORE INTO DAOFactoryEvents
        (contractAddress, blockNumber, blockTimestamp, transactionHash, logIndex, daoAddress, tokenAddress, amount)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const stmt = db.prepare(sql);
    try {
        const info = stmt.run(
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