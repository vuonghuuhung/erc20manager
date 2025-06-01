import hre from "hardhat";
import { MultisigDAO__factory } from "../typechain-types";

const main = async () => {
  const [account] = await hre.ethers.getSigners()

  console.log(account.address);
  const dao = MultisigDAO__factory.connect('0x4278C38439831A9217E96E88b7A4685c3054d18e', account);

  const res = await dao.getProposalDetails(0);
  console.log(res);
};

main().catch((error) => {
  console.log(error);
});

