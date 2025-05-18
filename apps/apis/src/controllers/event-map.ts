import { AbiEvent, Log, Transaction } from "viem";

export type EventMapHandler = {
    [key: string]: (
        log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
        transaction: Transaction,
        timestamp: number
    ) => void;
}