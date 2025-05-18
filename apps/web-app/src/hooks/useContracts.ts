/* eslint-disable @typescript-eslint/no-explicit-any */
import { contractAddress } from "@/config/config";
import { config } from "@/main";
import { ERC20Factory__factory } from "@repo/contracts";
import { toBigInt } from "ethers";
import { useEffect, useState } from "react";
import type { Abi } from "viem";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import type { Config, UseReadContractParameters } from "wagmi";
import { simulateContract } from "@wagmi/core";
import { MODAL_STEP } from "@/components/ModalStep/ModalStep";
import useListTransactionStore from "@/store/listTransactionState";
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

export function useContractWrite(functionNameTx: string, urlReCall?: string) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  const [methodName, setMethodName] = useState<string>(functionNameTx);

  const [stepModal, setStepModal] = useState<MODAL_STEP>(MODAL_STEP.READY);
  const [errorWrite, setErrorWrite] = useState<string>("");

  const publicClient = usePublicClient({
    config,
  });
  const { writeContractAsync, data, isSuccess, ...rest } = useWriteContract();
  const { setListTransaction, reset } = useListTransactionStore();

  useEffect(() => {
    if (data) {
      setListTransaction({
        hash: data,
        functionName: methodName,
        urlReCall: urlReCall || "",
      });
    }
  }, [data, setListTransaction, methodName, urlReCall]);

  useEffect(() => {
    setMethodName("");
    // reset()
  }, [address, reset]);

  const write = async ({
    abi,
    args,
    functionName,
    contractAddress,
    messageInitial,
    methodName,
  }: {
    args: any;
    abi: Abi;
    contractAddress: any;
    functionName: string;
    messageInitial?: string;
    methodName?: string;
  }) => {
    if (!isConnected) {
      setErrorWrite("You need to connect wallet");
      return;
    }
    setStepModal(MODAL_STEP.PROCESSING);
    setErrorWrite(messageInitial || "");
    try {
      const gasPrice = (await publicClient?.getGasPrice()) as bigint;
      const setUpMethod: any = {
        abi: abi,
        address: contractAddress,
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
      await writeContractAsync(request);
      setMethodName(methodName || functionNameTx);
      setStepModal(MODAL_STEP.SUCCESS);
    } catch (error: any) {
      console.log("error", { error });
      if (
        error?.shortMessage.includes(
          "Arithmetic operation resulted in underflow or overflow"
        )
      ) {
        setErrorWrite("You don't have enough balance");
        setStepModal(MODAL_STEP.FAILED);
        return;
      }

      if (error?.shortMessage.includes("0x42494dfc")) {
        setErrorWrite(
          "The member list must not contain the 0x0 (zero address)."
        );
        setStepModal(MODAL_STEP.FAILED);
        return;
      }

      if (error?.shortMessage.includes("0xdcc42366")) {
        setErrorWrite(
          "The owner list contains duplicate addresses. Please ensure all addresses are unique."
        );
        setStepModal(MODAL_STEP.FAILED);
        return;
      }

      if (error?.shortMessage.includes("MultisigDAO:")) {
        const reason = error?.shortMessage?.split("MultisigDAO:")[1]?.trim();
        setErrorWrite(reason);
        setStepModal(MODAL_STEP.FAILED);
        return;
      }

      if (error?.cause?.data?.errorName === "MultisigDAO_InvalidOwner") {
        setErrorWrite(
          "You are not the owner of this DAO. Please contact the owner for assistance."
        );
        setStepModal(MODAL_STEP.FAILED);
        return;
      }

      setErrorWrite(
        error?.shortMessage || "Something went wrong. Please try again."
      );
      setStepModal(MODAL_STEP.FAILED);
    }
  };

  return {
    write,
    stepModal,
    setStepModal,
    setErrorWrite,
    methodName,
    isConnected,
    errorWrite,
    isWriteSuccess: isSuccess,
    ...rest,
  };
}
