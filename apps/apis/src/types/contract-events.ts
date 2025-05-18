import { Abi, AbiEvent, Log, Transaction } from "viem";

export interface ContractEventConfig {
    factoryName: string;
    contractAddress: `0x${string}`;
    abi: Abi;
    handleEvent: (log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>, transaction: Transaction, timestamp: number) => void;
}