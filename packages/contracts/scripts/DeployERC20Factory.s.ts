import hre from "hardhat";

const main = async () => {
  const Erc20Factory = await hre.ethers.getContractFactory("ERC20Factory");
  const erc20Factory = await Erc20Factory.deploy();

  console.log(erc20Factory.target);
};

main().catch((error) => {
  console.log(error);
});
