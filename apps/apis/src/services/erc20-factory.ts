import { AbiEvent, Log } from "viem"
import { insertNewERC20 } from "../models/erc20-factory.js"
import { ERC20FactoryCreateEventArgs, EventMetadata } from "../types/events.js"

export const handleCreateERC20 = async (log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>) => {
    try {
        const metadata: EventMetadata = {
            contractAddress: log.address,
            blockNumber: log.blockNumber,
            blockTimestamp: 1,
            transactionHash: log.transactionHash,
            logIndex: log.logIndex,
        }

        const eventArgs = log.args as Record<string, unknown>;

        const args: ERC20FactoryCreateEventArgs = {
            ownerAddress: eventArgs["owner"] as string,
            tokenAddress: eventArgs["token"] as string,
            amount: eventArgs["amount"] as bigint,
        }

        console.log(metadata);
        console.log(args);

        await insertNewERC20(metadata, args);
        console.log("Inserted ERC20FactoryEvent from tx", log.transactionHash, "log", log.logIndex);
    } catch (error) {
        console.error("Error inserting ERC20FactoryEvent", error);
    }
}
