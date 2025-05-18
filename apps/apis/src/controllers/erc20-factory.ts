import { ERC20Factory__factory } from "@repo/contracts";
import { AbiEvent, Log, Transaction } from "viem";
import { handleCreateERC20 } from "../services/erc20-factory.js";
import { ContractEventConfig } from "../types/contract-events.js";
import { EventMapHandler } from "./event-map.js";

const eventMapHandler: EventMapHandler = {
    "Create": (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => {
        // console.log("New ERC20 created", log);
        handleCreateERC20(log, transaction, timestamp);
    },
}

export const erc20FactoryHandler = (): ContractEventConfig => {
    const handleEvent = (log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>, transaction: Transaction, timestamp: number) => {
        const { eventName } = log;

        if (eventName && eventMapHandler[eventName]) {
            eventMapHandler[eventName](log, transaction, timestamp);
        } else {
            console.log(`Unhandled event: ${eventName}`);
        }
    }

    return {
        factoryName: "ERC20Factory",
        contractAddress: "0x0ca0EdB15e8c9cDe6FE8d7eb58C7ee14B0ecFa60",
        abi: ERC20Factory__factory.abi,
        handleEvent,
    }
}



