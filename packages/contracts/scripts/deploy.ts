import * as hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("Deploying ERC20Factory...");
  const ERC20Factory = await ethers.getContractFactory("ERC20Factory");
  const erc20Factory = await ERC20Factory.deploy();
  await erc20Factory.waitForDeployment();
  console.log(
    `✅ ERC20Factory deployed at: ${await erc20Factory.getAddress()}`
  );

  console.log("🎉 All contracts deployed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
