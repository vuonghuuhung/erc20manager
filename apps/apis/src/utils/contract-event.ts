import type { AbiEvent, Log, PublicClient, Transaction, WatchContractEventReturnType } from "viem";
import { ContractEventConfig } from "../types/contract-events.js";

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
    onLogs: async (logs: Log[]) => {
      for (const log of logs) {
        const transaction = await client.getTransaction({
          hash: log.transactionHash as `0x${string}`,
        });

        const block = await client.getBlock({
          blockHash: transaction.blockHash as `0x${string}`,
        });

        await processLog(log as Log<bigint, number, false, AbiEvent, true, AbiEvent[]>, config, transaction, Number(block.timestamp));
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
  config: ContractEventConfig,
  transaction: Transaction,
  timestamp: number
): Promise<void> {
  const logId = `tx=${log.transactionHash} index=${log.logIndex}`;

  try {
    config.handleEvent(log, transaction, timestamp);
  } catch (error: any) {
    console.error(
      `!!!!!! [${config.factoryName}] CRITICAL ERROR processing log (${logId}):`,
      error?.message,
      error
    );
  }
}

