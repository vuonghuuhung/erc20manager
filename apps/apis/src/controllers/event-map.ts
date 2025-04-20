import { AbiEvent, Log } from "viem";

export type EventMapHandler = {
    [key: string]: (log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>) => void;
}