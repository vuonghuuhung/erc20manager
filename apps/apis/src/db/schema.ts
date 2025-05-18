import { relations } from 'drizzle-orm';
import {
    integer,
    sqliteTable,
    text
} from 'drizzle-orm/sqlite-core';

// DAO table
export const daos = sqliteTable('daos', {
    address: text('address').notNull().primaryKey(),
    tokenAddress: text('token_address').notNull(), // ref
    blockNumber: integer('block_number').notNull(),
    transactionId: text('transaction_id').notNull(), // ref
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});

export const daosRelations = relations(daos, ({ many, one }) => ({
    transactions: many(transactions),
    token: one(erc20, {
        fields: [daos.tokenAddress],
        references: [erc20.contractAddress]
    }),
    createdTransaction: one(transactions, {
        fields: [daos.transactionId],
        references: [transactions.hash]
    })
}))

// ERC20 Token table done
export const erc20 = sqliteTable('erc20', {
    contractAddress: text('contract_address').notNull().primaryKey(),
    name: text('name'),
    symbol: text('symbol'),
    decimals: integer('decimals'),
    totalSupply: text('total_supply'),
    owner: text('owner').notNull(),
    transactionId: text('transaction_id').notNull(), // ref
});

export const erc20Relations = relations(erc20, ({ many, one }) => ({
    transactions: many(transactions),
    createdTransaction: one(transactions, {
        fields: [erc20.transactionId],
        references: [transactions.hash]
    }),
}))

// Transaction Table
export const transactions = sqliteTable('transactions', {
    hash: text('hash').notNull().primaryKey(),
    method: text('method').notNull(),
    block: integer('block').notNull(),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    from: text('from').notNull(), // ref
    to: text('to').notNull(), // ref
    amount: text('amount').notNull(),
    txnFee: text('txn_fee').notNull(),
    gas: text('gas').notNull(),
    gasPrice: text('gas_price').notNull(),
    maxFeePerGas: text('max_fee_per_gas').notNull(),
    maxPriorityFeePerGas: text('max_priority_fee_per_gas').notNull(),
    nonce: integer('nonce').notNull(),
    input: text('input').notNull(),
    transactionIndex: integer('transaction_index').notNull(),
    transactionType: text('transaction_type').notNull(),
    parsedType: text('parsed_type').notNull(), // transactionTypes
    logEvents: text('log_events', { mode: 'json' }).notNull(),
    status: text('status').notNull(),
    daoAddress: text('dao_address'),
    erc20Address: text('erc20_address'),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    dao: one(daos, {
        fields: [transactions.daoAddress],
        references: [daos.address]
    }),
    erc20: one(erc20, {
        fields: [transactions.erc20Address],
        references: [erc20.contractAddress]
    }),
}))

// Token Holders table
export const tokenHolders = sqliteTable('token_holders', {
    id: text('id').notNull().primaryKey(), // composite key of token_address + holder_address
    tokenAddress: text('token_address').notNull(),
    holderAddress: text('holder_address').notNull(),
    balance: text('balance').notNull().default('0'),
    lastUpdatedBlock: integer('last_updated_block').notNull(),
    lastUpdatedTimestamp: integer('last_updated_timestamp', { mode: 'timestamp' }).notNull(),
});

export const tokenHoldersRelations = relations(tokenHolders, ({ one }) => ({
    token: one(erc20, {
        fields: [tokenHolders.tokenAddress],
        references: [erc20.contractAddress]
    })
}));