import {
    blob,
    integer,
    sqliteTable,
    text
} from 'drizzle-orm/sqlite-core';

const transactionTypes = ['erc20_transfer', 'erc20_approval', 'erc20_ownership_transfer', 'dao_create', 'dao_proposal_submit', 'dao_proposal_approve', 'dao_proposal_execute', 'dao_proposal_metadata_update', 'dao_proposal_revoke'];

export const accounts = sqliteTable('accounts', {
    id: text('id').primaryKey(),
    address: text('address').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

// DAO table
export const daos = sqliteTable('daos', {
    id: text('id').primaryKey(),
    address: text('address').notNull(),
    tokenAddress: text('token_address').references(() => erc20.contractAddress),
    createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

// export const daoProposals = sqliteTable('dao_proposals', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     daoId: uuid('dao_id').references(() => daos.id),
//     proposalId: integer('proposal_id').notNull(),
//     createdAt: timestamp('created_at').defaultNow(),
// });

// export const daoMembers = sqliteTable('dao_members', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     daoId: uuid('dao_id').references(() => daos.id),
//     address: text('address').notNull().references(() => accounts.address),
//     createdAt: timestamp('created_at').defaultNow(),
// });

// ERC20 Token table done
export const erc20 = sqliteTable('erc20', {
    id: text('id').primaryKey(),
    contractAddress: text('contract_address').notNull(),
    name: text('name'),
    symbol: text('symbol'),
    decimals: integer('decimals'),
    totalSupply: text('total_supply'),
    owner: text('owner'),
    createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

// ERC20 Holder
// export const erc20Holders = sqliteTable('erc20_holders', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     address: text('address').notNull().references(() => accounts.address),
//     balance: text('balance'),
//     tokenId: uuid('token_id').references(() => erc20.id),
// });

// Transaction Table
export const transactions = sqliteTable('transactions', {
    id: text('id').primaryKey(),
    hash: text('hash').notNull(),
    method: text('method'),
    block: integer('block'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    from: text('from').references(() => accounts.address),
    to: text('to').references(() => accounts.address),
    amount: text('amount'),
    txnFee: text('txn_fee'),
    gas: text('gas'),
    gasPrice: text('gas_price'),
    maxFeePerGas: text('max_fee_per_gas'),
    maxPriorityFeePerGas: text('max_priority_fee_per_gas'),
    nonce: integer('nonce'),
    input: text('input'),
    transactionIndex: integer('transaction_index'),
    transactionType: text('transaction_type'),
    parsedType: text('parsed_type'), // transactionTypes
    logEvents: blob('log_events', { mode: 'json' }),
    status: text('status'),
    daoId: text('dao_id').references(() => daos.id),
    erc20Id: text('erc20_id').references(() => erc20.id),
});
