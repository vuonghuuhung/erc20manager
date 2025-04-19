// eventConfig.ts

import { ERC20Factory__factory, DAOFactory__factory } from "@repo/contracts";
import { insertERC20FactoryEvent, insertDaoFactoryEvent } from "../db/index";
import type {
  EventMetadata,
  ERC20FactoryEventArgs,
  DaoFactoryEventArgs,
} from "../types/events";
import type { Abi } from "viem";

export interface ContractEventConfig<TArgs> {
  factoryName: string;
  contractAddress: `0x${string}`;
  abi: Abi;
  eventName: string;
  validateAndGetEventArgs: (logArgs: any) => TArgs | null;
  insertEventFunction: (metadata: EventMetadata, args: TArgs) => void;
}

export const erc20FactoryConfig: ContractEventConfig<ERC20FactoryEventArgs> = {
  factoryName: "ERC20Factory",
  contractAddress: "0x43c94F926324e449Bd39d31c1a5B9Ae00dB4107f",
  abi: ERC20Factory__factory.abi,
  eventName: "Create",
  validateAndGetEventArgs: (logArgs: any): ERC20FactoryEventArgs | null => {
    if (
      logArgs &&
      typeof logArgs.owner === "string" &&
      typeof logArgs.token === "string" &&
      typeof logArgs.amount === "bigint"
    ) {
      return {
        ownerAddress: logArgs.owner,
        tokenAddress: logArgs.token,
        amount: logArgs.amount,
      };
    }
    console.warn(
      `[${erc20FactoryConfig.factoryName}] Invalid or missing event args detected. Args received:`,
      logArgs
    );
    return null;
  },
  insertEventFunction: insertERC20FactoryEvent,
};

export const daoFactoryConfig: ContractEventConfig<DaoFactoryEventArgs> = {
  factoryName: "DAOFactory",
  contractAddress: "0x02fafadBACA6DedB97C6419617dc52A99393D624",
  abi: DAOFactory__factory.abi,
  eventName: "Create",
  validateAndGetEventArgs: (logArgs: any): DaoFactoryEventArgs | null => {
    if (
      logArgs &&
      typeof logArgs.daoAddress === "string" &&
      typeof logArgs.token === "string" &&
      typeof logArgs.amount === "bigint"
    ) {
      return {
        daoAddress: logArgs.daoAddress,
        tokenAddress: logArgs.token,
        amount: logArgs.amount,
      };
    }
    console.warn(
      `[${daoFactoryConfig.factoryName}] Invalid or missing event args detected. Args received:`,
      logArgs
    );
    return null;
  },
  insertEventFunction: insertDaoFactoryEvent,
};
