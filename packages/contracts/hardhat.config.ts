import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";


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
      accounts: [`0xb2eb5049f078780bbeb3fc8207f2280dcd7c733fe017fb2b6acd1c8542ceacd8`],   
     }
  },
};

export default config;
