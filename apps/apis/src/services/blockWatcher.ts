import { publicClient } from "../constants/publicClient";
import type { Block } from "viem";

export function startBlockWatcher() {
  console.log("🚀 Block watcher started. Waiting for new blocks...");

  const watchBlocks = publicClient.watchBlocks({
    emitOnBegin: true,
    onBlock: (block: Block) => {
      console.log("-----------------------------------------");
      console.log(`✅ New Block Received!`);
      console.log(`   Number: ${block.number}`);
      console.log(`   Hash: ${block.hash}`);
      console.log(`   Timestamp: ${new Date(Number(block.timestamp) * 1000)}`);
      console.log(`   Transactions: ${block.transactions.length}`);
    },
    onError: (error: Error) => {
      console.error("❌ Error watching blocks:", error.message, error);
    },
  });
  return watchBlocks;
}
