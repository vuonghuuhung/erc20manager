import { AbiEvent, Log, Transaction } from "viem";

export const handleCreateERC20 = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        console.log("Handling ERC20FactoryEvent", {
            log,
            transaction,
            timestamp
        });
    } catch (error) {
        console.error("Error inserting ERC20FactoryEvent", error);
    }
}
