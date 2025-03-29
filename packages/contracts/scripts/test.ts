import hre from "hardhat";
import { ERC20Factory__factory } from "../typechain-types";

const main = async () => {
  const [account] = await hre.ethers.getSigners()
  const erc20Factory = ERC20Factory__factory.connect('0x5fbdb2315678afecb367f032d93f642f64180aa3', account);

  const res = await erc20Factory.mintERC20("Test", "TEST", 10000000);
  console.log(res);
};

main().catch((error) => {
  console.log(error);
});

