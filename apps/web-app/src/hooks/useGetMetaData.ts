import { pinata } from "@/utils/http";
import { MultisigDAO__factory } from "@repo/contracts";
import { useEffect, useState } from "react";
import { useReadContracts } from "wagmi";
import { MetaDataDaoType } from "./useDAODetail";

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
  console.log("data metadata", data);

  // useEffect(() => {
  //   const handleGetMetaData = async (url: string) => {
  //     try {
  //       setIsGetMetaData(true);
  //       const gatewaysMetadata = await pinata.gateways.public.get(url);
  //       setDataMetaDataReturn((prev) => [
  //         ...prev,
  //         gatewaysMetadata.data as any,
  //       ]);
  //       setIsGetMetaData(false);
  //     } catch (error) {
  //       console.log(error);
  //       setIsGetMetaData(false);
  //     }
  //   };
  //   if (data && data?.length > 0) {
  //     for (let index = 0; index < data.length; index++) {
  //       if (data[index]?.error) {
  //         setIsErrorContractAddress(true);
  //         return;
  //       } else {
  //         handleGetMetaData(data[index].result as string);
  //       }
  //     }
  //   }
  // }, [data]);

  useEffect(() => {
    const handleGetAllMetaData = async () => {
      try {
        setIsGetMetaData(true);

        const metadataPromises = data?.map(async (item) => {
          if (item?.error) {
            setIsErrorContractAddress(true);
          }
          try {
            const res = await pinata.gateways.public.get(item.result as string);
            return res.data;
          } catch (error) {
            console.log(error);
            return null;
          }
        });

        const allMetaData = await Promise.all(metadataPromises as []);
        setDataMetaDataReturn(allMetaData as MetaDataDaoType[]);
      } catch (err) {
        console.error(err);
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
