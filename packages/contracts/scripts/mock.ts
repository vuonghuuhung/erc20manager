import hre from "hardhat";

const main = async () => {
  const Erc20Factory = await hre.ethers.getContractFactory("ERC20Factory");
  const erc20Factory = await Erc20Factory.deploy();

  const res = await erc20Factory.mintERC20Manager("Test", "TEST", 18, 10000000);
  console.log(res);
};

main().catch((error) => {
  console.log(error);
});
