import { DAOFactory__factory } from "@repo/contracts";
import { Abi, Log } from "viem";
import { EventMapHandler } from "./event-map.js";
import { handleCreateDao } from "../services/dao-factory.js";

export interface ContractEventConfig {
    factoryName: string;
    contractAddress: `0x${string}`;
    abi: Abi;
    handleEvent: (log: Log) => void;
}

const eventMapHandler: EventMapHandler = {
    "Create": (log: Log<bigint, number, false, any, true, typeof DAOFactory__factory.abi>) => {
        console.log("New DAO created", log);
        handleCreateDao(log);
    },
}

export const daoFactoryHandler = (): ContractEventConfig => {
    const handleEvent = (log: Log<bigint, number, false, any, true, typeof DAOFactory__factory.abi>) => {
        const { eventName } = log;

        if (eventName && eventMapHandler[eventName]) {
            eventMapHandler[eventName](log);
        } else {
            console.log(`Unhandled event: ${eventName}`);
        }
    }

    return {
        factoryName: "DAOFactory",
        contractAddress: "0x6F88a87B44f479BbEb9D609AC42F35c834e7d398",
        abi: DAOFactory__factory.abi,
        handleEvent,
    }
}