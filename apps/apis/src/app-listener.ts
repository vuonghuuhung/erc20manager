import type { PublicClient, WatchContractEventReturnType } from "viem";
import { holesky } from "viem/chains";
import { getPublicClient } from "wagmi/actions";
import { wagmiConfig } from "./config/wagmiConfig.js";
import { ContractEventConfig } from "./controllers/erc20-factory.js";
import { contractWatcher } from "./utils/contract-event.js";

class AppListener {
    private client: PublicClient;
    private unwatchFunctions: WatchContractEventReturnType[];

    constructor() {
        this.unwatchFunctions = [];
        this.client = getPublicClient(wagmiConfig, {
            chainId: holesky.id,
        });
    }

    get(config: ContractEventConfig) {
        this.unwatchFunctions.push(contractWatcher(this.client, config));
    }

    shutdown() {
        this.unwatchFunctions.forEach((unwatch) => {
            try {
                unwatch();
            } catch (err) {
                console.error("Error during unwatch:", err);
            }
        });
        console.log("Event watchers stopped.");
    }
}

export const appListener = () => {
    return new AppListener();
}