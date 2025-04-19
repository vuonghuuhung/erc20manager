import type { ContractEventConfig } from "../config/eventConfig.js";
import type { EventMetadata } from "../types/events.js";

export async function processLog<TArgs>(
  log: any,
  config: ContractEventConfig<TArgs>
): Promise<void> {
  const logId = `tx=${log.transactionHash} index=${log.logIndex}`;

  if (
    !log.args ||
    typeof log.blockNumber !== "bigint" ||
    !log.transactionHash ||
    typeof log.logIndex !== "number" ||
    !log.blockHash
  ) {
    console.warn(
      `[${config.factoryName}] Skipping log (${logId}) due to missing essential properties.`
    );

    return;
  }

  const validatedArgs = config.validateAndGetEventArgs(log.args);

  if (!validatedArgs) {
    return;
  }

  try {
    // const block = await publicClient.getBlock({ blockHash: log.blockHash });

    const metadata: EventMetadata = {
      contractAddress: log.address,
      blockNumber: log.blockNumber,
      blockTimestamp: 1, // FIXME!
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
    };
    config.insertEventFunction(metadata, validatedArgs);
  } catch (error: any) {
    console.error(
      `!!!!!! [${config.factoryName}] CRITICAL ERROR processing log (${logId}):`,
      error?.message,
      error
    );
  }
}
