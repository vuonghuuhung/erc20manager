import { AbiEvent, Log } from "viem";
import { insertNewDao } from "../models/dao-factory.js";
import { DaoFactoryCreateEventArgs, EventMetadata } from "../types/events.js";

export const handleCreateDao = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>
) => {
    const metadata: EventMetadata = {
        contractAddress: log.address,
        blockNumber: log.blockNumber,
        blockTimestamp: 1,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
    }

    const eventArgs = log.args as Record<string, unknown>;

    const args: DaoFactoryCreateEventArgs = {
        daoAddress: eventArgs["daoAddress"] as string,
        tokenAddress: eventArgs["token"] as string,
        amount: eventArgs["amount"] as bigint,
    }

    await insertNewDao(metadata, args);
    console.log("Inserted DAOFactoryEvent from tx", log.transactionHash, "log", log.logIndex);
}
