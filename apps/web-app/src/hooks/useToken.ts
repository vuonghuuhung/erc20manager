/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Abi } from "viem";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import type { Config, UseReadContractParameters } from "wagmi";
import { ERC20Template__factory } from "@repo/contracts";
import { config } from "@/main";
import { useEffect, useState } from "react";
import { simulateContract } from "@wagmi/core";
import { toBigInt } from "ethers";
import useListTransactionStore from "@/store/listTransactionState";

type UseTokenReadParameters = Omit<
  UseReadContractParameters,
  "abi" | "address" | "functionName" | "args"
>;

export function useTokenRead<T = unknown>(
  functionName: string,
  tokenAddress: `0x${string}`,
  args: Array<any> = [],
  options?: UseTokenReadParameters
) {
  return useReadContract<Abi, string, Array<any>, Config, T>({
    abi: ERC20Template__factory.abi,
    address: tokenAddress,
    functionName: functionName,
    args,
    query: {} as any,
    ...options,
  });
}
type functionNameType =
  | "approve"
  | "burn"
  | "permit"
  | "transfer"
  | "transferFrom";

export function useTokenWrite({
  functionName,
  tokenAddress,
}: {
  functionName: functionNameType;
  tokenAddress: `0x${string}`;
}) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorWrite, setErrorWrite] = useState<string>("");

  const publicClient = usePublicClient({
    config,
  });
  const { writeContractAsync, data, isSuccess, ...rest } = useWriteContract();
  const {setListTransaction} = useListTransactionStore();
  useEffect(() => {
    if (data) {
      setListTransaction({
        hash: data,
        functionName
      });
    } 
  }, [data, setListTransaction, functionName]);

  const write = async (args: any = []) => {
    if (!isConnected) {
      setErrorWrite("You need to connect wallet");
      return;
    }
    setIsLoading(true);
    setErrorWrite("");
    try {
      const gasPrice = (await publicClient?.getGasPrice()) as bigint;
      const setUpMethod: any = {
        abi: ERC20Template__factory.abi,
        address: tokenAddress,
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
        setIsLoading(false);
        setErrorWrite("You don't have enough balance");
        return;
      }
      const { request } = await simulateContract(config, setUpMethod);
      await writeContractAsync(request);
    } catch (error: any) {
      console.log("error", { error });
      if (
        error?.shortMessage.includes(
          "Arithmetic operation resulted in underflow or overflow"
        )
      ) {
        setErrorWrite("You don't have enough balance");
        return;
      }
      if (error?.cause?.data?.errorName === "ERC20InvalidReceiver") {
        setErrorWrite(
          "The receiver address is invalid. Please check the address."
        );
        return;
      }
      if (error?.cause?.data?.errorName === "ERC20InsufficientBalance") {
        setErrorWrite("You don't have enough balance");
        return;
      }
      setErrorWrite(error?.shortMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    write,
    isLoading,
    errorWrite,
    isWriteSuccess: isSuccess,
    ...rest,
  };
}
