import { MultisigDAO__factory } from "@repo/contracts";
import { AbiEvent, Log, Transaction } from "viem";
import db from "../db/db.js";
import * as schema from "../db/schema.js";
import { handleDaoApprove, handleDaoExecute, handleDaoRevoke, handleDaoSubmit, handleMetadataUpdated } from "../services/dao.js";
import { ContractEventConfig } from "../types/contract-events.js";
import { EventMapHandler } from "./event-map.js";

// Event handlers for DAO events based on MultisigDAO.sol
const eventMapHandler: EventMapHandler = {
    "Submit": (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => {
        handleDaoSubmit(log, transaction, timestamp);
    },
    "Approve": (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => {
        handleDaoApprove(log, transaction, timestamp);
    },
    "Revoke": (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => {
        handleDaoRevoke(log, transaction, timestamp);
    },
    "Execute": (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => {
        handleDaoExecute(log, transaction, timestamp);
    },
    "MetadataUpdated": (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => {
        handleMetadataUpdated(log, transaction, timestamp);
    }
};

export const daoHandler = async (): Promise<ContractEventConfig[]> => {
    // Fetch all DAOs from the database
    const daos = await db.select().from(schema.daos);

    console.log(`Found ${daos.length} DAOs in the database`);

    // Create config for each DAO
    return daos.map(dao => {
        const handleEvent = (
            log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
            transaction: Transaction,
            timestamp: number
        ) => {
            const { eventName } = log;

            if (eventName && eventMapHandler[eventName]) {
                eventMapHandler[eventName](log, transaction, timestamp);
            } else {
                console.log(`Unhandled event for DAO ${dao.address}: ${eventName}`);
            }
        };

        return {
            factoryName: `DAO-${dao.address.slice(0, 6)}`,
            contractAddress: dao.address as `0x${string}`,
            abi: MultisigDAO__factory.abi,
            handleEvent,
        };
    });
};
