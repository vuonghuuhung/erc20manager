import { AbiEvent, Log, Transaction } from "viem";
import { AppListener } from "../app-listener.js";
import { Method } from "../config/methods.js";
import db from "../db/db.js";
import * as schema from "../db/schema.js";
import { updateTokenHolderBalance } from "./token-holder.js";

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

        // Normalize addresses to lowercase
        const normalizedTokenAddress = String(tokenAddress).toLowerCase();
        const normalizedOwner = String(owner).toLowerCase();

        // First insert the token record into the database
        await db.insert(schema.transactions).values({
            hash: String(transactionHash),
            method: String(transaction.input.slice(0, 10)),
            block: Number(blockNumber),
            timestamp: new Date(timestamp * 1000),
            from: String(transaction.from).toLowerCase(),
            to: String(transaction.to).toLowerCase(),
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
                tokenAddress: normalizedTokenAddress,
                name: String(name),
                symbol: String(symbol),
                decimals: String(decimals),
                totalSupply: String(totalSupply),
                owner: normalizedOwner,
            },
            status: "Success",
            erc20Address: normalizedTokenAddress,
        });

        await db.insert(schema.erc20).values({
            contractAddress: normalizedTokenAddress,
            name: String(name),
            symbol: String(symbol),
            decimals: Number(decimals),
            totalSupply: String(totalSupply),
            owner: normalizedOwner,
            transactionId: String(transactionHash),
        });

        // Initialize creator's balance with total supply
        await updateTokenHolderBalance(
            normalizedTokenAddress,
            normalizedOwner,
            BigInt(totalSupply),
            Number(blockNumber),
            timestamp,
            true // add the total supply to creator's balance
        );

        console.log("Successfully inserted ERC20FactoryEvent", {
            tokenAddress: normalizedTokenAddress,
            name,
            symbol,
            decimals,
            totalSupply,
            owner: normalizedOwner,
            blockNumber,
            transactionHash
        });

        // Get the AppListener instance and register the new token for watching
        try {
            const appInstance = AppListener.getInstance();
            if (appInstance) {
                await appInstance.registerNewERC20(normalizedTokenAddress);
                console.log(`Registered new ERC20 token ${normalizedTokenAddress} for watching`);
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
