import { ERC20FactoryCreateEventArgs } from "../types/events.js";

import { getDb } from "../db/index.js";

import { EventMetadata } from "../types/events.js";

export const insertNewERC20 = async (metadata: EventMetadata, args: ERC20FactoryCreateEventArgs) => {
    const db = getDb();

    const sql = `
      INSERT OR IGNORE INTO ERC20FactoryEvents
        (contractAddress, blockNumber, blockTimestamp, transactionHash, logIndex, ownerAddress, tokenAddress, amount)
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
