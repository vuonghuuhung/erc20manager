import { wagmiConfig } from "../config/wagmiConfig.js";
import { getPublicClient } from "wagmi/actions";
import { holesky } from "wagmi/chains";

export const publicClient = getPublicClient(wagmiConfig, {
  chainId: holesky.id,
});
if (!publicClient) {
  console.error(
    `FATAL: Could not get public client for chainId ${holesky.id}. Check wagmiConfig.`
  );
  process.exit(1);
}
