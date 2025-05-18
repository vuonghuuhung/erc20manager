import { AbiEvent, Log, Transaction } from "viem";
import { Method } from "../config/methods.js";
import db from "../db/db.js";
import * as schema from "../db/schema.js";
import { handleTokenHolderTransfer } from "./token-holder.js";

// Handle ERC20 token transfer event
export const handleERC20Transfer = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        const args = log.args as Record<string, any>;
        const tokenAddress = log.address;
        const from = args.from;
        const to = args.to;
        const value = args.value;
        const blockNumber = log.blockNumber;
        const transactionHash = transaction.hash;

        console.log("ERC20 Transfer event", {
            token: tokenAddress,
            from: from,
            to: to,
            value: value.toString(),
            transaction: transactionHash
        });

        // Store in database
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
            parsedType: Method.ERC20_TRANSFER,
            logEvents: {
                tokenAddress: String(tokenAddress),
                from: String(from),
                to: String(to),
                value: String(value),
            },
            status: "Success",
            erc20Address: String(tokenAddress),
        });

        // Update token holder balances
        await handleTokenHolderTransfer(log, transaction, timestamp);

    } catch (error) {
        console.error("Error handling ERC20 Transfer event:", error);
    }
};

// Handle ERC20 token approval event
export const handleERC20Approval = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        const args = log.args as Record<string, any>;
        const tokenAddress = log.address;
        const owner = args.owner;
        const spender = args.spender;
        const value = args.value;
        const blockNumber = log.blockNumber;
        const transactionHash = transaction.hash;

        console.log("ERC20 Approval event", {
            token: tokenAddress,
            owner: owner,
            spender: spender,
            value: value.toString(),
            transaction: transactionHash
        });

        // Store in database
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
            parsedType: Method.ERC20_APPROVAL,
            logEvents: {
                tokenAddress: String(tokenAddress),
                owner: String(owner),
                spender: String(spender),
                value: String(value),
            },
            status: "Success",
            erc20Address: String(tokenAddress),
        });

    } catch (error) {
        console.error("Error handling ERC20 Approval event:", error);
    }
}; 