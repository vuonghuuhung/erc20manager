import { gql } from "@apollo/client";

export const GetAllTransactions = gql`
  query GetAllTransactions(
    $where: TransactionsFilters
    $offset: Int
    $limit: Int
  ) {
    transactions(where: $where, offset: $offset, limit: $limit) {
      hash
      method
      block
      timestamp
      from
      to
    }
  }
`;

export const GetTransactionByHash = gql`
  query GetTransactionByHash($where: TransactionsFilters) {
    transactions(where: $where) {
      amount
      block
      from
      gas
      gasPrice
      hash
      input
      method
      status
      timestamp
      to
      txnFee
    }
  }
`;

export const getTokenHolders = gql`
  query getTokenHolders(
    $offset: Int
    $limit: Int
    $where: TokenHoldersFilters
    $orderBy: TokenHoldersOrderBy
  ) {
    tokenHolders(
      offset: $offset
      limit: $limit
      where: $where
      orderBy: $orderBy
    ) {
      balance
      holderAddress
      token {
        totalSupply
      }
    }
  }
`;
