import { AbiEvent, Log, Transaction } from "viem";
import { Method } from "../config/methods.js";
import db from "../db/db.js";
import * as schema from "../db/schema.js";

// Handle proposal submission event
export const handleDaoSubmit = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        const args = log.args as Record<string, any>;
        const daoAddress = log.address;
        const proposalId = args.proposalId;
        const creator = args.creator;
        const to = args.to;
        const value = args.value;
        const action = args.action;
        const data = args.data;
        const metadataURI = args.metadataURI;
        const blockNumber = log.blockNumber;
        const transactionHash = transaction.hash;

        console.log("DAO Proposal Submitted event", {
            dao: daoAddress,
            proposalId: proposalId,
            creator: creator,
            to: to,
            value: value,
            action: action,
            data: data,
            metadataURI: metadataURI,
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
            parsedType: Method.DAO_SUBMIT,
            logEvents: {
                daoAddress: String(daoAddress),
                proposalId: String(proposalId),
                creator: String(creator),
                to: String(to),
                value: String(value),
                action: String(action),
                data: String(data),
                metadataURI: String(metadataURI),
            },
            status: "Success",
            daoAddress: String(daoAddress),
        });

    } catch (error) {
        console.error("Error handling DAO Submit event:", error);
    }
};

// Handle proposal approval event
export const handleDaoApprove = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        const args = log.args as Record<string, any>;
        const daoAddress = log.address;
        const proposalId = args.proposalId;
        const approver = args.approver;
        const blockNumber = log.blockNumber;
        const transactionHash = transaction.hash;

        console.log("DAO Proposal Approved event", {
            dao: daoAddress,
            approver: approver,
            proposalId: proposalId,
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
            parsedType: Method.DAO_APPROVE,
            logEvents: {
                daoAddress: String(daoAddress),
                proposalId: String(proposalId),
                approver: String(approver),
            },
            status: "Success",
            daoAddress: String(daoAddress),
        });

    } catch (error) {
        console.error("Error handling DAO Approve event:", error);
    }
};

// Handle proposal revoke/reject event
export const handleDaoRevoke = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        const args = log.args as Record<string, any>;
        const daoAddress = log.address;
        const proposalId = args.proposalId;
        const revoker = args.revoker;
        const blockNumber = log.blockNumber;
        const transactionHash = transaction.hash;

        console.log("DAO Proposal Revoked/Rejected event", {
            dao: daoAddress,
            revoker: revoker,
            proposalId: proposalId,
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
            parsedType: Method.DAO_REVOKE,
            logEvents: {
                daoAddress: String(daoAddress),
                proposalId: String(proposalId),
                revoker: String(revoker),
            },
            status: "Success",
            daoAddress: String(daoAddress),
        });

    } catch (error) {
        console.error("Error handling DAO Revoke event:", error);
    }
};

// Handle proposal execution event
export const handleDaoExecute = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        const args = log.args as Record<string, any>;
        const daoAddress = log.address;
        const proposalId = args.proposalId;
        const executor = args.executor;
        const blockNumber = log.blockNumber;
        const transactionHash = transaction.hash;

        console.log("DAO Proposal Executed event", {
            dao: daoAddress,
            executor: executor,
            proposalId: proposalId,
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
            parsedType: Method.DAO_EXECUTE,
            logEvents: {
                daoAddress: String(daoAddress),
                proposalId: String(proposalId),
                executor: String(executor),
            },
            status: "Success",
            daoAddress: String(daoAddress),
        });

    } catch (error) {
        console.error("Error handling DAO Execute event:", error);
    }
};

// Handle metadata update event
export const handleMetadataUpdated = async (
    log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
    transaction: Transaction,
    timestamp: number
) => {
    try {
        const args = log.args as Record<string, any>;
        const daoAddress = log.address;
        const oldMetadata = args.oldMetadata;
        const newMetadata = args.newMetadata;
        const blockNumber = log.blockNumber;
        const transactionHash = transaction.hash;

        console.log("DAO Metadata Updated event", {
            dao: daoAddress,
            oldMetadata: oldMetadata,
            newMetadata: newMetadata,
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
            parsedType: Method.DAO_METADATA_UPDATED,
            logEvents: {
                daoAddress: String(daoAddress),
                oldMetadata: String(oldMetadata),
                newMetadata: String(newMetadata),
            },
            status: "Success",
            daoAddress: String(daoAddress),
        });

    } catch (error) {
        console.error("Error handling DAO MetadataUpdated event:", error);
    }
}; 