import { BigNumberish, ethers } from "ethers";

export const handleConvertToToken = (
  value: BigNumberish,
  decimals: number = 18
) => {
  const formattedValue = ethers.formatUnits(value, decimals);
  const number = parseFloat(formattedValue);
  return number % 1 === 0 ? number.toString() : number.toFixed(3);
};
