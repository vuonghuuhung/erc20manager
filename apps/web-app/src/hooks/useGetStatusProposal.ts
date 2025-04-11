import { ProposalStatus } from "@/constants/token";
import { pinata } from "@/utils/http";
import { MultisigDAO__factory } from "@repo/contracts";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useReadContracts } from "wagmi";

export interface Proposal {
  action: number;
  data: string;
  isExecuted: boolean;
  isRejected: boolean;
  metadataURI: string;
  to: string;
  value: bigint;
}

export interface MetaDataProposalType {
  index: number;
  description?: string;
  isOwner?: boolean;
  isApproved?: boolean;
  isRejected?: boolean;
  status?: ProposalStatus;
}

const useGetStatusProposal = (
  contractAddress: `0x${string}` | undefined,
  listProposal: Proposal[]
) => {
  const [isErrorContractAddress, setIsErrorContractAddress] =
    useState<boolean>(false);
  const { address } = useAccount();

  const [isGetMetaData, setIsGetMetaData] = useState<boolean>(false);
  const [dataReturn, setDataReturn] = useState<MetaDataProposalType[]>([]);
  const calls = listProposal.flatMap((_, index) => [
    {
      address: contractAddress,
      abi: MultisigDAO__factory.abi,
      functionName: "s_isOwner",
      args: [address],
      
    },
    {
      address: contractAddress,
      abi: MultisigDAO__factory.abi,
      functionName: "s_isApproved",
      args: [BigInt(index), address as `0x${string}`],
    },
    {
      address: contractAddress,
      abi: MultisigDAO__factory.abi,
      functionName: "s_isRejected",
      args: [BigInt(index), address as `0x${string}`],
    },
  ]);

  const callsStatus = listProposal.flatMap((_, index) => [
    {
      address: contractAddress,
      abi: MultisigDAO__factory.abi,
      functionName: "getProposalStatus",
      args: [index],
    },
  ]);

  const { data, isLoading, isFetching, isError, refetch, ...rest } =
    useReadContracts({
      contracts: calls,
      query: {
        enabled: contractAddress !== undefined && address !== undefined,
      },
    });

  console.log("data test", data);

  const {
    data: dataStatus,
    isLoading: isLoadingStatus,
    isFetching: isFetchingStatus,
    isError: isErrorStatus,
    refetch: refetchStatus,
    ...restStatus
  } = useReadContracts({
    contracts: callsStatus,
    query: {
      enabled: contractAddress !== undefined,
    },
  });
  console.log("data proposal approve", dataStatus);

  const handleRefetch = () => {
    refetch();
    refetchStatus();
  };

  useEffect(() => {
    const handleGetAllMetaData = async () => {
      try {
        setIsGetMetaData(true);
        const metadataPromises = listProposal?.map(async (item) => {
          try {
            const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
              ["string"],
              item?.data as string
            );
            const res = await pinata.gateways.public
              .get(decodedData[0])
              .then((res) => {
                return res.data;
              });
            return res;
          } catch (error) {
            console.log("hello cac ban", error);
            setIsErrorContractAddress(true);
            setIsGetMetaData(false);
            return null;
          }
        });
        const allMetaData = await Promise.all(metadataPromises as []);
        if (dataStatus && allMetaData?.length > 0) {
          const merged = allMetaData.map(
            (item: { description: string }, index) => {
              const baseIndex = index * 3;
              return {
                index,
                description: item?.description,
                status: dataStatus[index].result,
                isOwner: data && data[baseIndex].result,
                isApproved: data && data[baseIndex + 1].result,
                isRejected: data && data[baseIndex + 2].result,
              };
            }
          );
          setDataReturn(merged as MetaDataProposalType[]);
        }
      } catch (err) {
        console.error("co loi day", { err });
        setIsErrorContractAddress(true);
      } finally {
        setIsGetMetaData(false);
      }
    };

    if (listProposal && listProposal.length > 0) {
      handleGetAllMetaData();
    }
  }, [listProposal, data, dataStatus]);

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

  return {
    data: dataReturn,
    isError: isError || isErrorContractAddress || isErrorStatus,
    isLoading:
      isLoading ||
      isFetching ||
      isGetMetaData ||
      isLoadingStatus ||
      isFetchingStatus,
    refetch: handleRefetch,
    rest,
    restStatus,
  };
};

export default useGetStatusProposal;
