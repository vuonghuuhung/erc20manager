import { handleConvertToToken } from "@/utils/convertNumber";
import { ERC20Manager__factory } from "@repo/contracts";
import { useEffect, useState } from "react";
import { useReadContracts } from "wagmi";

export interface TokenDetails {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

const useTokenDetails = (tokenAddresses: `0x${string}`[] = []) => {
  const [isErrorContractAddress, setIsErrorContractAddress] =
    useState<boolean>(false);
  const calls = tokenAddresses.flatMap((address) => [
    {
      address,
      abi: ERC20Manager__factory.abi,
      functionName: "name",
      args: [],
    },
    {
      address,
      abi: ERC20Manager__factory.abi,
      functionName: "symbol",
      args: [],
    },
    {
      address,
      abi: ERC20Manager__factory.abi,
      functionName: "decimals",
      args: [],
    },
    {
      address,
      abi: ERC20Manager__factory.abi,
      functionName: "totalSupply",
      args: [],
    },
  ]);

  const { data, isLoading, isFetching, isError, ...rest } = useReadContracts({
    contracts: calls,
  });

  useEffect(() => {
    if (
      data &&
      data?.length > 0 &&
      data[0]?.error?.name == "InvalidAddressError"
    ) {
      setIsErrorContractAddress(true);
    }
  }, [data]);

  const formattedData: TokenDetails[] =
    data && Array.isArray(data) && data.length > 0
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

  return {
    data: formattedData,
    isLoading: isFetching || isLoading,
    isFetching,
    isError,
    isErrorContractAddress,
    ...rest,
  };
};

export default useTokenDetails;
