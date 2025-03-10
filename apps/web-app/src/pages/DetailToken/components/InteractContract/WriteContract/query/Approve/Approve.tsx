import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ERC20Manager__factory } from "@repo/contracts";
import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { contractSchema, ReadContractType } from "@/utils/Rules";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import LoadingQuery from "@/components/LoadingQuery/LoadingQuery";
import InputNumber from "@/components/InputNumber";
import { ethers, toBigInt } from "ethers";
import { simulateContract } from "@wagmi/core";
import { config } from "@/main";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { contractAddress } from "@/config/config";

type ApproveType = Pick<ReadContractType, "spenderAddress" | "amount">;
const approveType = contractSchema.pick({
  amount: true,
  spenderAddress: true,
});

const Approve: FC<{ decimals?: number }> = ({ decimals }) => {
  const publicClient = usePublicClient({
    config,
  });
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const { writeContractAsync, data: txHash } = useWriteContract();
  const { isFetching, status: statusWaitTx } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const form = useForm<ApproveType>({
    resolver: zodResolver(approveType),
    defaultValues: {
      spenderAddress: "",
      amount: "",
    },
  });

  async function onSubmit(values: ApproveType) {
    try {
      const { amount, spenderAddress } = values;
      const gasPrice = (await publicClient?.getGasPrice()) as bigint;
      const amountValue = ethers.parseUnits(amount, decimals || 18);
      const { request } = await simulateContract(config, {
        address: contractAddress.address,
        abi: ERC20Manager__factory.abi,
        functionName: "approve",
        args: [spenderAddress as `0x${string}`, amountValue],
      });
      const estimatedGas = (await publicClient?.estimateContractGas({
        address: contractAddress.address,
        abi: ERC20Manager__factory.abi,
        functionName: "approve",
        args: [spenderAddress as `0x${string}`, amountValue],
        account: address,
      })) as bigint;
      const gasCost = estimatedGas * gasPrice;
      const num1 = toBigInt(balance?.value || "0");
      const num2 = toBigInt(gasCost);
      if (num1 <= num2) {
        alert("You don't have enough ETH to create tweet");
        return;
      }
      await writeContractAsync(request);
    } catch (error) {
      console.log("error", { error });
    }
  }
  return (
    <Collapsible className="border-[#e9ecef] border rounded-xl overflow-hidden mb-2">
      <CollapsibleTrigger className="w-full text-left bg-[#f8f9fa] py-1 px-3">
        approve
      </CollapsibleTrigger>
      <CollapsibleContent className="py-2 px-3">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="text-[12px] mb-1">_spender (address)</div>
              <FormField
                control={form.control}
                name="spenderAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="_spender (address)"
                        {...field}
                        className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-[12px] mb-1 mt-2">_value</div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputNumber
                        placeholder="_spender"
                        {...field}
                        className="block w-full h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="!mt-4">Write</Button>
            </form>
          </Form>
          {/* {isGetBalance && <LoadingQuery />}
          {balanceToken !== undefined && (
            <div className="mt-2">Response: {balanceToken}</div>
          )} */}
        </div>
        {/* {error && (
          <div className="mt-2 text-sm font-medium text-destructive">
            {error.shortMessage}
          </div>
        )} */}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Approve;
