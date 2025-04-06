/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { config } from "@/main";
import { ERC20Factory__factory, DAOFactory__factory } from "@repo/contracts";
import { ethers, toBigInt } from "ethers";
import { useEffect, useState } from "react";
import type { Abi } from "viem";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { Config, UseReadContractParameters } from "wagmi";
import { simulateContract } from "@wagmi/core";
import { contractAddress } from "@/config/config";
import { MODAL_STEP } from "@/components/ModalStep/ModalStep";
import { pinata } from "@/utils/http";
import { CreateDAOContractSchemaType } from "@/utils/Rules";
import { DECIMALS } from "@/constants/token";

type UseContractReadParameters = Omit<
  UseReadContractParameters,
  "abi" | "address" | "functionName" | "args"
>;

export function useContractRead<T = unknown>(
  functionName: string,
  args: Array<any> = [],
  options?: UseContractReadParameters
) {
  return useReadContract<Abi, string, Array<any>, Config, T>({
    abi: ERC20Factory__factory.abi,
    functionName: functionName,
    address: contractAddress.ERC20FactoryAddress,
    args,
    query: {} as any,
    ...options,
  });
}

type functionNameType = "mintERC20" | "createDAO";

export function useContractWrite({
  functionName,
}: {
  functionName: functionNameType;
}) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  const [stepModal, setStepModal] = useState<MODAL_STEP>(MODAL_STEP.READY);
  const [errorWrite, setErrorWrite] = useState<string>("");

  const publicClient = usePublicClient({
    config,
  });
  const { writeContractAsync, data, ...rest } = useWriteContract();

  const { isFetching, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    if (isFetching) {
      setStepModal(MODAL_STEP.PROCESSING);
    }
  }, [isFetching]);

  useEffect(() => {
    if (isSuccess) {
      setStepModal(MODAL_STEP.SUCCESS);
    } else {
      setStepModal(MODAL_STEP.READY);
    }
  }, [isSuccess]);

  const write = async (args: any = [], daoInfo?: CreateDAOContractSchemaType) => {
    if (!isConnected) {
      setErrorWrite("You need to connect wallet");
      return;
    }
    setStepModal(MODAL_STEP.PROCESSING);
    setErrorWrite("");
    try {
      const gasPrice = (await publicClient?.getGasPrice()) as bigint;
      const amountValue = ethers.parseUnits(daoInfo?.amount || "0", DECIMALS);
      const setUpMethod: any = daoInfo
        ? {
            abi: DAOFactory__factory.abi,
            address: contractAddress.DAOFactoryAddress,
            args: [
              daoInfo.listAddress,
              daoInfo.requireVote,
              daoInfo.nameToken,
              daoInfo.symbol,
              18,
              amountValue,
              "",
            ],
            functionName,
            account: address,
          }
        : {
            abi: ERC20Factory__factory.abi,
            address: contractAddress.ERC20FactoryAddress,
            args,
            functionName,
            account: address,
          };
      const estimatedGas = (await publicClient?.estimateContractGas(
        setUpMethod
      )) as bigint;
      const gasCost = estimatedGas * gasPrice;
      const num1 = toBigInt(balance?.value || "0");
      const num2 = toBigInt(gasCost);
      if (num1 <= num2) {
        setStepModal(MODAL_STEP.FAILED);
        setErrorWrite("You don't have enough balance");
        return;
      }
      const { request } = await simulateContract(config, setUpMethod);
      if (daoInfo && daoInfo.avatarFile) {
        const upload = await pinata.upload.public
          .file(daoInfo.avatarFile)
          .group("87de2c19-9d65-4cff-9fd1-08a426a68411");
        const gatewayUrlImg = await pinata.gateways.public.convert(upload.cid);
        const uploadDataJson = await pinata.upload.public
          .json({
            name: daoInfo.nameDAO,
            description: daoInfo.descriptionDao,
            image: gatewayUrlImg,
          })
          .group("eda38d13-ccf0-4bf8-bddd-43245a3851c1");
        await writeContractAsync({
          ...request,
          args: [
            daoInfo.listAddress,
            daoInfo.requireVote,
            daoInfo.nameToken,
            daoInfo.symbol,
            18,
            amountValue,
            uploadDataJson.cid,
          ],
        });
      } else {
        await writeContractAsync(request);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error", { error });
      if (
        error?.shortMessage.includes(
          "Arithmetic operation resulted in underflow or overflow"
        )
      ) {
        setErrorWrite("You don't have enough balance");
      } else {
        setErrorWrite(error?.shortMessage || "Something went wrong");
      }
      setStepModal(MODAL_STEP.FAILED);
    }
  };

  return {
    write,
    stepModal,
    setStepModal,
    isConnected,
    errorWrite,
    isWriteSuccess: isSuccess,
    ...rest,
  };
}
