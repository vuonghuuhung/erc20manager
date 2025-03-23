import BoxContent from "@/components/BoxContent";
import { createTokenSchema, CreateTokenType } from "@/utils/Rules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ERC20Factory__factory } from "@repo/contracts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import InputNumber from "@/components/InputNumber";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import ConnectButtonCustom from "@/components/ConnectButtonCustom/ConnectButtonCustom";
import { simulateContract } from "@wagmi/core";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { ethers, toBigInt } from "ethers";
import { config } from "@/main";
import { contractAddress } from "@/config/config";
import ModalStep, { MODAL_STEP } from "@/components/ModalStep/ModalStep";
import { useEffect, useState } from "react";

const CreateToken = () => {
  const publicClient = usePublicClient({
    config,
  });
  const [stepModal, setStepModal] = useState<MODAL_STEP>(MODAL_STEP.READY);
  const [messageError, setMessageError] = useState<string>("");

  const { isConnected, address } = useAccount();
  const { data: balanceETH } = useBalance({
    address,
  });

  const form = useForm<CreateTokenType>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: "",
      amount: "",
    },
  });

  const { writeContractAsync, data: txHash } = useWriteContract();
  const { isFetching, isFetched } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function onSubmit(values: CreateTokenType) {
    try {
      setMessageError("Transaction processing...");
      setStepModal(MODAL_STEP.PROCESSING);
      const gasPrice = (await publicClient?.getGasPrice()) as bigint;
      const { name, symbol, decimals, amount } = values;
      const amountValue = ethers.parseUnits(amount, Number(decimals || 18));
      const { request } = await simulateContract(config, {
        address: contractAddress.ERC20FactoryAddress,
        abi: ERC20Factory__factory.abi,
        functionName: "mintERC20Manager",
        args: [name, symbol, Number(decimals), amountValue],
      });
      const estimatedGas = (await publicClient?.estimateContractGas({
        address: contractAddress.ERC20FactoryAddress,
        abi: ERC20Factory__factory.abi,
        functionName: "mintERC20Manager",
        args: [name, symbol, Number(decimals), amountValue],
        account: address,
      })) as bigint;

      const gasCost = estimatedGas * gasPrice;
      const num1 = toBigInt(balanceETH?.value || "0");
      const num2 = toBigInt(gasCost);
      if (num1 <= num2) {
        setMessageError("You don't have enough ETH");
        setStepModal(MODAL_STEP.FAILED);
        return;
      }
      await writeContractAsync(request);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error", { error });
      if (error?.name === "ContractFunctionExecutionError") {
        setMessageError(error?.shortMessage || "");
        setStepModal(MODAL_STEP.FAILED);
      }
    }
  }
  useEffect(() => {
    if (isFetched) {
      setMessageError("");
      setStepModal(MODAL_STEP.SUCCESS);
    }
    if (isFetching) {
      setStepModal(MODAL_STEP.PROCESSING);
    }
  }, [isFetched, isFetching]);
  return (
    <div>
      <BoxContent extendClassName="p-4 w-full max-w-[462px] mx-auto">
        <h3 className="text-[25px] text-[#223354] font-bold mb-6">
          Create Your Token
        </h3>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Token"
                        {...field}
                        className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem className="!mt-4">
                    <FormControl>
                      <Input
                        placeholder="Symbol"
                        {...field}
                        className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="decimals"
                render={({ field }) => (
                  <FormItem className="!mt-4">
                    <FormControl>
                      <InputNumber placeholder="Decimals" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="!mt-4">
                    <FormControl>
                      <InputNumber
                        min={4}
                        max={5}
                        placeholder="Amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isConnected ? (
                <Button type="submit" className="block w-full">
                  Submit
                </Button>
              ) : (
                <ConnectButtonCustom />
              )}
            </form>
          </Form>
        </div>
      </BoxContent>
      <ModalStep
        open={stepModal !== MODAL_STEP.READY}
        setOpen={setStepModal}
        contentStep={messageError}
        statusStep={stepModal}
      />
    </div>
  );
};

export default CreateToken;
