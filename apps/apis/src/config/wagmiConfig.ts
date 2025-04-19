import { webSocket, createConfig } from "wagmi";
import { mainnet, holesky } from "wagmi/chains";
import "dotenv/config";

export const wagmiConfig = createConfig({
  chains: [mainnet, holesky],
  pollingInterval: 1_000,
  transports: {
    [mainnet.id]: webSocket(
      `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
    [holesky.id]: webSocket(
      `wss://eth-holesky.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  },
});
