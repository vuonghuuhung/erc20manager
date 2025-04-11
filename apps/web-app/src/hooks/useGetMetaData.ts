import { pinata } from "@/utils/http";
import { MultisigDAO__factory } from "@repo/contracts";
import { useEffect, useState } from "react";
import { useReadContracts } from "wagmi";
import { MetaDataDaoType } from "./useDAODetail";
import { ethers } from "ethers";

const useGetMetaData = (daoAddresses: `0x${string}`[] = []) => {
  const [isErrorContractAddress, setIsErrorContractAddress] =
    useState<boolean>(false);
  const [isGetMetaData, setIsGetMetaData] = useState<boolean>(false);
  const [dataMetaDateReturn, setDataMetaDataReturn] = useState<
    MetaDataDaoType[]
  >([]);
  const calls = daoAddresses.flatMap((address) => [
    {
      address: address,
      abi: MultisigDAO__factory.abi,
      functionName: "getMetadata",
      args: [],
    },
  ]);
  const { data, isLoading, isError, ...rest } = useReadContracts({
    contracts: calls,
    query: {
      enabled: daoAddresses.length > 0,
    },
  });


  useEffect(() => {
    const handleGetAllMetaData = async () => {
      try {
        setIsGetMetaData(true);

        const metadataPromises = data?.map(async (item) => {
          if (item?.error) {
            setIsErrorContractAddress(true);
            return null;
          }
          try {
            const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
              ["string"],
              item?.result as string
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
        setDataMetaDataReturn(allMetaData as MetaDataDaoType[]);
      } catch (err) {
        console.error("co loi day", { err });
        setIsErrorContractAddress(true);
      } finally {
        setIsGetMetaData(false);
      }
    };

    if (data && data.length > 0) {
      handleGetAllMetaData();
    }
  }, [data]);

  return {
    data: dataMetaDateReturn,
    isLoading: isLoading || isGetMetaData,
    isError: isError || isErrorContractAddress,
    rest,
  };
};

export default useGetMetaData;
