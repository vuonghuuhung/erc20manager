import * as hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("Deploying ERC20Factory...");
  const ERC20Factory = await ethers.getContractFactory("ERC20Factory");
  const DAOFactory = await ethers.getContractFactory("DAOFactory");
  const erc20Factory = await ERC20Factory.deploy();
  const daoFactory = await DAOFactory.deploy();
  await erc20Factory.waitForDeployment();
  await daoFactory.waitForDeployment();
  console.log(
    `✅ ERC20Factory deployed at: ${await erc20Factory.getAddress()}`
  );

  console.log(
    `✅ DaoFactory deployed at: ${await daoFactory.getAddress()}`
  );

  console.log("🎉 All contracts deployed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
