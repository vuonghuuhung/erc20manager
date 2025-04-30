import { AbiEvent, Log, Transaction } from "viem";

export const handleCreateDao = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        console.log("Handling DAOFactoryEvent", {
            log,
            transaction,
            timestamp
        });
    } catch (error) {
        console.error("Error inserting DAOFactoryEvent", error);
    }
}
