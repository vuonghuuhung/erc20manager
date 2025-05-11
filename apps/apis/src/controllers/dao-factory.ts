import { DAOFactory__factory } from "@repo/contracts";
import { AbiEvent, Log, Transaction } from "viem";
import { handleCreateDao } from "../services/dao-factory.js";
import { ContractEventConfig } from "../types/contract-events.js";
import { EventMapHandler } from "./event-map.js";

const eventMapHandler: EventMapHandler = {
    "Create": (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => {
        handleCreateDao(log, transaction, timestamp);
    },
}

export const daoFactoryHandler = (): ContractEventConfig => {
    const handleEvent = (log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>, transaction: Transaction, timestamp: number) => {
        const { eventName } = log;

        if (eventName && eventMapHandler[eventName]) {
            eventMapHandler[eventName](log, transaction, timestamp);
        } else {
            console.log(`Unhandled event: ${eventName}`);
        }
    }

    return {
        factoryName: "DAOFactory",
        contractAddress: "0xDb199EA73546f00758D5AF32266bF3C7760A3b3B",
        abi: DAOFactory__factory.abi,
        handleEvent,
    }
}