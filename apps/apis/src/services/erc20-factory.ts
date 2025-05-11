import { AbiEvent, Log, Transaction } from "viem";
import { AppListener } from "../app-listener.js";
import { Method } from "../config/methods.js";
import db from "../db/db.js";
import * as schema from "../db/schema.js";

export const handleCreateERC20 = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        const events = log.args as Record<string, any>;
        const tokenAddress = events["token"];
        const name = events["name"];
        const symbol = events["symbol"];
        const decimals = events["decimals"];
        const totalSupply = events["supply"];
        const owner = events["owner"];
        const blockNumber = log.blockNumber;
        const transactionHash = transaction.hash;

        // First insert the token record into the database
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
            parsedType: Method.CreateERC20,
            logEvents: {
                tokenAddress: String(tokenAddress),
                name: String(name),
                symbol: String(symbol),
                decimals: String(decimals),
                totalSupply: String(totalSupply),
                owner: String(owner),
            },
            status: "Success",
            erc20Address: String(tokenAddress),
        });

        await db.insert(schema.erc20).values({
            contractAddress: String(tokenAddress),
            name: String(name),
            symbol: String(symbol),
            decimals: Number(decimals),
            totalSupply: String(totalSupply),
            owner: String(owner),
            transactionId: String(transactionHash),
        });

        console.log("Successfully inserted ERC20FactoryEvent", {
            tokenAddress,
            name,
            symbol,
            decimals,
            totalSupply,
            owner,
            blockNumber,
            transactionHash
        });

        // Get the AppListener instance and register the new token for watching
        try {
            const appInstance = AppListener.getInstance();
            if (appInstance) {
                await appInstance.registerNewERC20(String(tokenAddress));
                console.log(`Registered new ERC20 token ${tokenAddress} for watching`);
            } else {
                console.log("AppListener instance not available, cannot register token for watching");
            }
        } catch (error) {
            console.error("Error registering new ERC20 for watching:", error);
        }
    } catch (error) {
        console.error("Error inserting ERC20FactoryEvent", error);
    }
}
