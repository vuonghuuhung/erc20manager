import { contractAddress } from "@/config/config";
import { ERC20Factory__factory } from "@repo/contracts";
import { useEffect, useState } from "react";
import { useReadContracts } from "wagmi";

export interface DaoTokenDetails {
  addressDao: string;
  addressToken: string;
  name: string;
  symbol: string;
  decimals: number;
  listProposal?: any[];
}

const useContractDetail = (daoAddresses: `0x${string}`[] = []) => {
  const [isErrorContractAddress, setIsErrorContractAddress] =
    useState<boolean>(false);
  const calls = daoAddresses.flatMap((address) => [
    {
      address: contractAddress.ERC20FactoryAddress,
      abi: ERC20Factory__factory.abi,
      functionName: "getERC20OfDAO",
      args: [address],
    },
    {
      address: contractAddress.ERC20FactoryAddress,
      abi: ERC20Factory__factory.abi,
      functionName: "getDAOProposals",
      args: [address],
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

  const formattedData: DaoTokenDetails[] =
    data && Array.isArray(data) && data.length > 0
      ? daoAddresses.map((address, index) => {
        const baseIndex = index * 2; // Mỗi token có 4 phần tử trong dataToken
          return {
            addressDao: address as string,
            addressToken: data[baseIndex]?.result && (data[baseIndex]?.result[0] as string) || "",
            name: data[baseIndex]?.result && (data[baseIndex]?.result[1] as string) || "",
            symbol: data[baseIndex]?.result && (data[baseIndex]?.result[2] as string) || "",
            decimals: data[baseIndex]?.result && (data[baseIndex]?.result[3] as any) || 18,
            listProposal: data[baseIndex + 1]?.result as any || [],
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

export default useContractDetail;
