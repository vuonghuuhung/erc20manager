/* eslint-disable @typescript-eslint/no-explicit-any */
import { contractAddress } from "@/config/config";
import { DAOFactory__factory, MultisigDAO__factory } from "@repo/contracts";
import { useEffect, useState } from "react";
import { useReadContracts } from "wagmi";

export interface MetaDataDaoType {
  name: string;
  description: string;
  image: string;
}

export interface DaoTokenDetails {
  addressDao: string;
  addressToken: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  listProposal?: any[];
}

const useDAODetail = (daoAddresses: `0x${string}`[] = []) => {
  const [isErrorContractAddress, setIsErrorContractAddress] =
    useState<boolean>(false);
  const calls = daoAddresses.flatMap((address) => [
    {
      address: contractAddress.DAOFactoryAddress,
      abi: DAOFactory__factory.abi,
      functionName: "getERC20MetadataOfDAO",
      args: [address],
    },
    {
      address: address,
      abi: MultisigDAO__factory.abi,
      functionName: "getAllProposals",
      args: [],
    },
  ]);

  const { data, isLoading, isFetching, isError, ...rest } = useReadContracts({
    contracts: calls,
  });

  console.log("data", data);

  useEffect(() => {
    if (data && data?.length > 0) {
      data.forEach((item) => {
        if (item?.error) {
          setIsErrorContractAddress(true);
          return;
        }
      });
    }
  }, [data]);

  const formattedData: DaoTokenDetails[] =
    data && Array.isArray(data) && data.length > 0
      ? daoAddresses.map((address, index) => {
          const baseIndex = index * 2;
          const DataType = data as any;
          return {
            addressDao: address as string,
            addressToken: (DataType[baseIndex]?.result[0] as string) || "",
            name: (DataType[baseIndex]?.result[1] as string) || "",
            symbol: (DataType[baseIndex]?.result[2] as string) || "",
            decimals: (DataType[baseIndex]?.result[3] as any) || 18,
            totalSupply: (DataType[baseIndex]?.result[4] as any) || BigInt(0),
            listProposal: (DataType[baseIndex + 1]?.result as any) || [],
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

export default useDAODetail;
