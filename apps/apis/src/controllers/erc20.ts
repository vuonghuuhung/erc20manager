import { ERC20Template__factory } from "@repo/contracts";
import { AbiEvent, Log, Transaction } from "viem";
import db from "../db/db";
import * as schema from "../db/schema";
import { handleERC20Approval, handleERC20Transfer } from "../services/erc20.js";
import { ContractEventConfig } from "../types/contract-events.js";
import { EventMapHandler } from "./event-map.js";

// Event handlers for ERC20 token events
const eventMapHandler: EventMapHandler = {
    "Transfer": (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => {
        handleERC20Transfer(log, transaction, timestamp);
    },
    "Approval": (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => {
        handleERC20Approval(log, transaction, timestamp);
    }
};

export const erc20Handler = async (): Promise<ContractEventConfig[]> => {
    // Fetch all ERC20 tokens from the database
    const erc20Tokens = await db.select().from(schema.erc20);

    console.log(`Found ${erc20Tokens.length} ERC20 tokens in the database`);

    // Create config for each token
    return erc20Tokens.map(token => {
        const handleEvent = (
            log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
            transaction: Transaction,
            timestamp: number
        ) => {
            const { eventName } = log;

            if (eventName && eventMapHandler[eventName]) {
                eventMapHandler[eventName](log, transaction, timestamp);
            } else {
                console.log(`Unhandled event for token ${token.contractAddress}: ${eventName}`);
            }
        };

        return {
            factoryName: `ERC20-${token.symbol || 'Token'}-${token.contractAddress.slice(0, 6)}`,
            contractAddress: token.contractAddress as `0x${string}`,
            abi: ERC20Template__factory.abi,
            handleEvent,
        };
    });
};
