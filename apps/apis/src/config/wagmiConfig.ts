import { webSocket, createConfig } from "wagmi";
import { holesky } from "wagmi/chains";
import "dotenv/config";

export const wagmiConfig = createConfig({
  chains: [holesky],
  
  pollingInterval: 10_000,
  transports: {
    [holesky.id]: webSocket(
      `wss://eth-holesky.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  },
});
