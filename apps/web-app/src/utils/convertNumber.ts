import { BigNumberish, ethers } from "ethers";

export const handleConvertToToken = (
  value: BigNumberish,
  decimals: number = 18
) => {
  return ethers.formatUnits(value, decimals);
};
