export interface EventMetadata {
  contractAddress: string;
  blockNumber: bigint;
  blockTimestamp: number;
  transactionHash: string;
  logIndex: number;
}

export interface ERC20FactoryEventArgs {
  ownerAddress: string;
  tokenAddress: string;
  amount: bigint;
}

export interface DaoFactoryEventArgs {
  daoAddress: string;
  tokenAddress: string;
  amount: bigint;
}
