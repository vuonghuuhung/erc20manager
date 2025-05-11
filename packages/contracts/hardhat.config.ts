import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "dotenv/config";
import { ethers } from "ethers";
import { HardhatUserConfig } from "hardhat/config";

let privateKeys: string[] = [];
for (let i = 0; i < 20; i++) {
  const wallet = ethers.Wallet.createRandom();
  privateKeys = [...privateKeys, wallet.privateKey];
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    holesky: {
      url: "https://eth-holesky.g.alchemy.com/v2/cOQtLz0U1KR-mxS_zXyuFMZaI1-FPMvh",
      accounts: [process.env.PRIVATE_KEY || privateKeys[0], ...privateKeys],
    },
  },
};

export default config;
