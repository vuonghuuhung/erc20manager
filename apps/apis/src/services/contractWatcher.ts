// contractWatcher.ts (Cleaned)
import type { PublicClient, Log, WatchContractEventReturnType } from "viem";
import type { ContractEventConfig } from "../config/eventConfig";
import { processLog } from "./eventProcessor";

export function contractWatcher<TArgs>(
  client: PublicClient,
  config: ContractEventConfig<TArgs>
): WatchContractEventReturnType {
  console.log(
    `Setting up watcher for ${config.factoryName} (${config.contractAddress})...`
  );

  const unwatch = client.watchContractEvent({
    address: config.contractAddress,
    abi: config.abi,
    eventName: config.eventName,
    onLogs: async (logs: Log[]) => {
      for (const log of logs) {
        await processLog(log, config);
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
