export interface EventMetadata {
  contractAddress: string;
  blockNumber: bigint;
  blockTimestamp: number;
  transactionHash: string;
  logIndex: number;
}

export interface ERC20FactoryCreateEventArgs {
  ownerAddress: string;
  tokenAddress: string;
  amount: bigint;
}

export interface DaoFactoryCreateEventArgs {
  daoAddress: string;
  tokenAddress: string;
  amount: bigint;
}
