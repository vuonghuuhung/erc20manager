import { handleConvertToToken } from "@/utils/convertNumber";
import { ERC20Manager__factory } from "@repo/contracts";
import { useReadContracts } from "wagmi";

export interface TokenDetails {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

const useTokenDetails = (tokenAddresses: `0x${string}`[] = []) => {
  const calls = tokenAddresses.flatMap((address) => [
    {
      address,
      abi: ERC20Manager__factory.abi,
      functionName: "name",
      ags: [],
    },
    {
      address,
      abi: ERC20Manager__factory.abi,
      functionName: "symbol",
      ags: [],
    },
    {
      address,
      abi: ERC20Manager__factory.abi,
      functionName: "decimals",
      ags: [],
    },
    {
      address,
      abi: ERC20Manager__factory.abi,
      functionName: "totalSupply",
      ags: [],
    },
  ]);

  const { data, isLoading, isError } = useReadContracts({
    contracts: calls,
  });

  console.log("dataToken", data);

  const formattedData: TokenDetails[] =
    data && Array.isArray(data)
      ? tokenAddresses.map((address, index) => {
          const baseIndex = index * 4; // Mỗi token có 4 phần tử trong dataToken
          return {
            name: (data[baseIndex]?.result as string) || "",
            symbol: (data[baseIndex + 1]?.result as string) || "",
            decimals: (data[baseIndex + 2]?.result as number) || 18,
            totalSupply: handleConvertToToken(
              data[baseIndex + 3]?.result || 0,
              data[baseIndex + 2]?.result as number
            ),
            address,
          };
        })
      : [];

  return { data: formattedData, isLoading, isError };
};

export default useTokenDetails;
