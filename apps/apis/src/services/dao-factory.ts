import { AbiEvent, Log, Transaction } from "viem";
import { AppListener } from "../app-listener.js";
import { Method } from "../config/methods.js";
import db from "../db/db.js";
import * as schema from "../db/schema.js";

export const handleCreateDao = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        const events = log.args as Record<string, any>;
        const daoAddress = events["daoAddress"];
        const tokenAddress = events["tokenAddress"];
        const name = events["name"];
        const owners = events["owners"] as string[];
        const threshold = events["threshold"];
        const symbol = events["symbol"];
        const decimals = events["decimals"];
        const supply = events["supply"];
        const metadata = events["metadata"];
        const blockNumber = log.blockNumber;
        const transactionHash = transaction.hash;

        // First insert the DAO record into the database
        await db.insert(schema.transactions).values({
            hash: String(transactionHash),
            method: String(transaction.input.slice(0, 10)),
            block: Number(blockNumber),
            timestamp: new Date(timestamp * 1000),
            from: String(transaction.from),
            to: String(transaction.to),
            amount: String(transaction.value),
            txnFee: String(transaction.gasPrice),
            gas: String(transaction.gas),
            gasPrice: String(transaction.gasPrice),
            maxFeePerGas: String(transaction.maxFeePerGas),
            maxPriorityFeePerGas: String(transaction.maxPriorityFeePerGas),
            nonce: Number(transaction.nonce),
            input: String(transaction.input),
            transactionIndex: Number(transaction.transactionIndex),
            transactionType: String(transaction.type),
            parsedType: Method.CreateDao,
            logEvents: {
                daoAddress: String(daoAddress),
                tokenAddress: String(tokenAddress),
                name: String(name),
                owners: owners.map(owner => String(owner)),
                threshold: String(threshold),
                symbol: String(symbol),
                decimals: String(decimals),
                supply: String(supply),
                metadata: String(metadata),
            },
            status: "Success",
            daoAddress: String(daoAddress),
            erc20Address: String(tokenAddress),
        });

        await db.insert(schema.daos).values({
            address: String(daoAddress),
            tokenAddress: String(tokenAddress),
            blockNumber: Number(blockNumber),
            transactionId: String(transactionHash),
            timestamp: new Date(timestamp * 1000),
        });

        console.log("Successfully inserted DAOFactoryEvent", {
            daoAddress,
            tokenAddress,
            name,
            owners,
            threshold,
            symbol,
            decimals,
            supply,
            metadata,
            blockNumber,
            transactionHash
        });

        // Get the AppListener instance and register the new DAO for watching
        try {
            const appInstance = AppListener.getInstance();
            if (appInstance) {
                await appInstance.registerNewDAO(String(daoAddress));
                console.log(`Registered new DAO ${daoAddress} for watching`);
            } else {
                console.log("AppListener instance not available, cannot register DAO for watching");
            }
        } catch (error) {
            console.error("Error registering new DAO for watching:", error);
        }
    } catch (error) {
        console.error("Error inserting DAOFactoryEvent", error);
    }
}
