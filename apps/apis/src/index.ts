import express, { Request, Response } from "express";
import type { WatchContractEventReturnType } from "viem";
import { getPublicClient } from "wagmi/actions";
import { holesky } from "wagmi/chains";
import { daoFactoryConfig, erc20FactoryConfig } from "./config/eventConfig.js";
import { wagmiConfig } from "./config/wagmiConfig.js";
import { closeDbConnection, getDb } from "./db/index.js";
import { appListener } from "./app-listener.js";

// connect to db
getDb();

const blockchainApp = appListener();

blockchainApp.get(erc20FactoryConfig);
blockchainApp.get(daoFactoryConfig);

// express app
const app = express();
const port = process.env.PORT || 3000;

// routes
app.get("/", (req: Request, res: Response) => {
  res.send("Event Listener API is running!");
});

// start server
const server = app.listen(port, () => {
  console.log(`✅ API Server listening on port ${port}`);
  console.log("🚀 Application started, watching for events...");
});

// shutdown
const shutdown = () => {
  console.log("\n🔌 Gracefully shutting down...");

  blockchainApp.shutdown();

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
