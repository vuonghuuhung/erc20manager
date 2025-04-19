import express, { Request, Response } from "express";
import type { WatchContractEventReturnType } from "viem";
import { getPublicClient } from "wagmi/actions";
import { holesky } from "wagmi/chains";
import { daoFactoryConfig, erc20FactoryConfig } from "./config/eventConfig.js";
import { wagmiConfig } from "./config/wagmiConfig.js";
import { closeDbConnection, getDb } from "./db/index.js";
import { contractWatcher } from "./services/contractWatcher.js";

const publicClient = getPublicClient(wagmiConfig, {
  chainId: holesky.id,
});

const app = express();
const port = process.env.PORT || 3000;

getDb();

const unwatchFunctions: WatchContractEventReturnType[] = [];

unwatchFunctions.push(contractWatcher(publicClient, erc20FactoryConfig));
unwatchFunctions.push(contractWatcher(publicClient, daoFactoryConfig));

app.get("/", (req: Request, res: Response) => {
  res.send("Event Listener API is running!");
});

const server = app.listen(port, () => {
  console.log(`✅ API Server listening on port ${port}`);
  console.log("🚀 Application started, watching for events...");
});

const shutdown = () => {
  console.log("\n🔌 Gracefully shutting down...");

  console.log(`Stopping ${unwatchFunctions.length} event watchers...`);
  unwatchFunctions.forEach((unwatch) => {
    try {
      unwatch();
    } catch (err) {
      console.error("Error during unwatch:", err);
    }
  });
  console.log("Event watchers stopped.");

  server.close((err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
    } else {
      console.log("HTTP server closed.");
    }

    closeDbConnection();

    console.log("Exiting process.");
    process.exit(err ? 1 : 0);
  });

  setTimeout(() => {
    console.error("Graceful shutdown timed out, forcing exit.");
    closeDbConnection();
    process.exit(1);
  }, 15000);
};

process.on("SIGINT", shutdown);
