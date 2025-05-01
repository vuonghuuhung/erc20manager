import { eq } from "drizzle-orm";
import type { PublicClient, WatchContractEventReturnType } from "viem";
import { holesky } from "viem/chains";
import { getPublicClient } from "wagmi/actions";
import { wagmiConfig } from "./config/wagmiConfig.js";
import { daoHandler } from "./controllers/dao.js";
import { erc20Handler } from "./controllers/erc20.js";
import db from "./db/db";
import * as schema from "./db/schema";
import { ContractEventConfig } from "./types/contract-events.js";
import { contractWatcher } from "./utils/contract-event.js";

export class AppListener {
    static client: PublicClient;
    private unwatchFunctions: WatchContractEventReturnType[];
    private registeredContracts: Set<string>;
    private static instance: AppListener | null = null;

    constructor() {
        this.unwatchFunctions = [];
        this.registeredContracts = new Set<string>();
        AppListener.client = getPublicClient(wagmiConfig, {
            chainId: holesky.id,
        });
        AppListener.instance = this;
    }

    static getInstance(): AppListener | null {
        return AppListener.instance;
    }

    static getClient() {
        if (!AppListener.client) {
            throw new Error("Client not initialized");
        }
        return AppListener.client;
    }

    get(config: ContractEventConfig) {
        // Check if we're already watching this contract
        if (this.registeredContracts.has(config.contractAddress)) {
            console.log(`Already watching ${config.factoryName} (${config.contractAddress})`);
            return;
        }

        this.unwatchFunctions.push(contractWatcher(AppListener.client, config));
        this.registeredContracts.add(config.contractAddress);
    }

    async initWatchers() {
        try {
            // Initialize ERC20 token watchers
            const erc20Configs = await erc20Handler();
            for (const config of erc20Configs) {
                this.get(config);
            }
            console.log(`Initialized watchers for ${erc20Configs.length} ERC20 tokens`);

            // Initialize DAO watchers
            const daoConfigs = await daoHandler();
            for (const config of daoConfigs) {
                this.get(config);
            }
            console.log(`Initialized watchers for ${daoConfigs.length} DAOs`);
        } catch (error) {
            console.error("Error initializing token and DAO watchers:", error);
        }
    }

    // Register a new ERC20 token for watching (called when a new token is created)
    async registerNewERC20(erc20Address: string) {
        try {
            // If already registered, skip
            if (this.registeredContracts.has(erc20Address as `0x${string}`)) {
                console.log(`ERC20 token ${erc20Address} is already being watched`);
                return true;
            }

            // Check if token exists in database (don't await the query yet)
            const tokensQuery = db.select().from(schema.erc20).where(eq(schema.erc20.contractAddress, erc20Address));
            const tokens = await tokensQuery;

            if (!tokens || tokens.length === 0) {
                console.log(`Token ${erc20Address} not found in database, cannot register watcher`);
                return false;
            }

            // Get single token configuration for newly created token
            const singleTokenHandler = async () => {
                const token = tokens[0];
                const erc20Configs = await erc20Handler();
                return erc20Configs.find(config => config.contractAddress === erc20Address as `0x${string}`);
            };

            const tokenConfig = await singleTokenHandler();

            if (tokenConfig) {
                this.get(tokenConfig);
                console.log(`Registered new ERC20 token watcher for ${erc20Address}`);
                return true;
            } else {
                console.log(`Failed to create watcher config for token ${erc20Address}`);
                return false;
            }
        } catch (error) {
            console.error(`Error registering new ERC20 token ${erc20Address}:`, error);
            return false;
        }
    }

    // Register a new DAO for watching (called when a new DAO is created)
    async registerNewDAO(daoAddress: string) {
        try {
            // If already registered, skip
            if (this.registeredContracts.has(daoAddress as `0x${string}`)) {
                console.log(`DAO ${daoAddress} is already being watched`);
                return true;
            }

            // Check if DAO exists in database (don't await the query yet)
            const daosQuery = db.select().from(schema.daos).where(eq(schema.daos.address, daoAddress));
            const daos = await daosQuery;

            if (!daos || daos.length === 0) {
                console.log(`DAO ${daoAddress} not found in database, cannot register watcher`);
                return false;
            }

            // Get single DAO configuration for newly created DAO
            const singleDaoHandler = async () => {
                const dao = daos[0];
                const daoConfigs = await daoHandler();
                return daoConfigs.find(config => config.contractAddress === daoAddress as `0x${string}`);
            };

            const daoConfig = await singleDaoHandler();

            if (daoConfig) {
                this.get(daoConfig);
                console.log(`Registered new DAO watcher for ${daoAddress}`);
                return true;
            } else {
                console.log(`Failed to create watcher config for DAO ${daoAddress}`);
                return false;
            }
        } catch (error) {
            console.error(`Error registering new DAO ${daoAddress}:`, error);
            return false;
        }
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