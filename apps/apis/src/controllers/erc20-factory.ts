import { ERC20Factory__factory } from "@repo/contracts";
import { Abi, AbiEvent, Log } from "viem";
import { handleCreateERC20 } from "../services/erc20-factory.js";
import { EventMapHandler } from "./event-map.js";

export interface ContractEventConfig {
    factoryName: string;
    contractAddress: `0x${string}`;
    abi: Abi;
    handleEvent: (log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>) => void;
}

const eventMapHandler: EventMapHandler = {
    "Create": (log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>) => {
        console.log("New ERC20 created", log);
        handleCreateERC20(log);
    },
}

export const erc20FactoryHandler = (): ContractEventConfig => {
    const handleEvent = (log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>) => {
        const { eventName } = log;

        if (eventName && eventMapHandler[eventName]) {
            eventMapHandler[eventName](log);
        } else {
            console.log(`Unhandled event: ${eventName}`);
        }
    }

    return {
        factoryName: "ERC20Factory",
        contractAddress: "0x3f7362DE446Acc32Ce6a0b3e7f04341ff491EBe8",
        abi: ERC20Factory__factory.abi,
        handleEvent,
    }
}



