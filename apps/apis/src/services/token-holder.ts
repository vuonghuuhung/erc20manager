import { eq } from "drizzle-orm";
import { AbiEvent, Log, Transaction } from "viem";
import db from "../db/db.js";
import * as schema from "../db/schema.js";

// Update token holder balance
export const updateTokenHolderBalance = async (
    tokenAddress: string,
    holderAddress: string,
    amount: bigint,
    blockNumber: number,
    timestamp: number,
    isAdd: boolean
) => {
    try {
        // Normalize addresses to lowercase
        const normalizedTokenAddress = tokenAddress.toLowerCase();
        const normalizedHolderAddress = holderAddress.toLowerCase();
        const holderId = `${normalizedTokenAddress}-${normalizedHolderAddress}`;

        // Get current holder record
        const currentHolder = await db.select()
            .from(schema.tokenHolders)
            .where(eq(schema.tokenHolders.id, holderId))
            .get();

        let newBalance: bigint;

        if (currentHolder) {
            // Update existing holder
            const currentBalance = BigInt(currentHolder.balance);
            newBalance = isAdd ? currentBalance + amount : currentBalance - amount;

            await db.update(schema.tokenHolders)
                .set({
                    balance: newBalance.toString(),
                    lastUpdatedBlock: blockNumber,
                    lastUpdatedTimestamp: new Date(timestamp * 1000)
                })
                .where(eq(schema.tokenHolders.id, holderId));
        } else {
            // Create new holder record
            newBalance = isAdd ? amount : BigInt(0);

            await db.insert(schema.tokenHolders).values({
                id: holderId,
                tokenAddress: normalizedTokenAddress,
                holderAddress: normalizedHolderAddress,
                balance: newBalance.toString(),
                lastUpdatedBlock: blockNumber,
                lastUpdatedTimestamp: new Date(timestamp * 1000)
            });
        }

        console.log(`Updated token holder balance for ${normalizedHolderAddress} of token ${normalizedTokenAddress}:`, {
            previousBalance: currentHolder?.balance || '0',
            newBalance: newBalance.toString(),
            change: `${isAdd ? '+' : '-'}${amount.toString()}`
        });

    } catch (error) {
        console.error("Error updating token holder balance:", error);
    }
};

// Update token total supply
export const updateTokenTotalSupply = async (
    tokenAddress: string,
    amount: bigint,
    isAdd: boolean,
    blockNumber: number,
    timestamp: number
) => {
    try {
        // Normalize token address to lowercase
        const normalizedTokenAddress = tokenAddress.toLowerCase();

        // Get current token record
        const token = await db.select()
            .from(schema.erc20)
            .where(eq(schema.erc20.contractAddress, normalizedTokenAddress))
            .get();

        if (!token || !token.totalSupply) {
            console.error(`Token ${normalizedTokenAddress} not found in database or has no total supply`);
            return;
        }

        const currentSupply = BigInt(token.totalSupply);
        const newSupply = isAdd ? currentSupply + amount : currentSupply - amount;

        await db.update(schema.erc20)
            .set({
                totalSupply: newSupply.toString()
            })
            .where(eq(schema.erc20.contractAddress, normalizedTokenAddress));

        console.log(`Updated total supply for token ${normalizedTokenAddress}:`, {
            previousSupply: currentSupply.toString(),
            newSupply: newSupply.toString(),
            change: `${isAdd ? '+' : '-'}${amount.toString()}`
        });

    } catch (error) {
        console.error("Error updating token total supply:", error);
    }
};

// Handle ERC20 transfer event for token holders
export const handleTokenHolderTransfer = async (
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

        const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

        // Handle minting (transfer from zero address)
        if (from === ZERO_ADDRESS) {
            await updateTokenTotalSupply(
                String(tokenAddress),
                value,
                true, // add to total supply
                Number(blockNumber),
                timestamp
            );
        }
        // Handle burning (transfer to zero address)
        else if (to === ZERO_ADDRESS) {
            await updateTokenTotalSupply(
                String(tokenAddress),
                value,
                false, // subtract from total supply
                Number(blockNumber),
                timestamp
            );
        }

        // Update sender's balance (subtract)
        if (from !== ZERO_ADDRESS) {
            await updateTokenHolderBalance(
                String(tokenAddress),
                String(from),
                value,
                Number(blockNumber),
                timestamp,
                false
            );
        }

        // Update recipient's balance (add)
        if (to !== ZERO_ADDRESS) {
            await updateTokenHolderBalance(
                String(tokenAddress),
                String(to),
                value,
                Number(blockNumber),
                timestamp,
                true
            );
        }

    } catch (error) {
        console.error("Error handling token holder transfer:", error);
    }
}; 