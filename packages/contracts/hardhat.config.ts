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
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ooTTNOyUpAQIYuIQU9ZSNiNrEgzBHcSd",
      accounts: [process.env.PRIVATE_KEY || "", ...privateKeys],
    },
  },
};

export default config;
