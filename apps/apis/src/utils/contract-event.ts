import type { AbiEvent, Log, PublicClient, WatchContractEventReturnType } from "viem";
import { ContractEventConfig } from "../controllers/erc20-factory.js";

export function contractWatcher(
  client: PublicClient,
  config: ContractEventConfig
): WatchContractEventReturnType {
  console.log(
    `Setting up watcher for ${config.factoryName} (${config.contractAddress})...`
  );

  const unwatch = client.watchContractEvent({
    address: config.contractAddress,
    abi: config.abi,
    // fromBlock: 3703228n,
    onLogs: async (logs: Log[]) => {
      for (const log of logs) {
        await processLog(log as Log<bigint, number, false, AbiEvent, true, AbiEvent[]>, config);
      }
    },
    onError: (error: Error) => {
      console.error(
        `❌ Error in ${config.factoryName} event watcher connection:`,
        error.message,
        error
      );
    },
  });

  console.log(`Watcher setup complete for ${config.factoryName}.`);
  return unwatch;
}

export async function processLog(
  log: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>,
  config: ContractEventConfig
): Promise<void> {
  const logId = `tx=${log.transactionHash} index=${log.logIndex}`;

  try {
    config.handleEvent(log);
  } catch (error: any) {
    console.error(
      `!!!!!! [${config.factoryName}] CRITICAL ERROR processing log (${logId}):`,
      error?.message,
      error
    );
  }
}

