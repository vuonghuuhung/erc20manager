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
import { useAccount, useBalance } from "wagmi";
import ConnectButtonCustom from "@/components/ConnectButtonCustom/ConnectButtonCustom";
import { simulateContract } from "@wagmi/core";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { config } from "@/main";
import { contractAddress } from "@/config/config";

const CreateToken = () => {
  const { isConnected, address } = useAccount();
  const { data } = useBalance({
    address,
  });
  console.log("balance", data);

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
  const { isFetching, status: statusWaitTx } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function onSubmit(values: CreateTokenType) {
    try {
      const { name, symbol, decimals, amount } = values;
      const amountValue = ethers.parseUnits(amount, 18);
      const { request } = await simulateContract(config, {
        address: contractAddress.address,
        abi: ERC20Factory__factory.abi,
        functionName: "mintERC20Manager",
        args: [name, symbol, Number(decimals), amountValue],
      });
      await writeContractAsync(request);
    } catch (error) {
      console.log("error", { error });
    }
  }
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
    </div>
  );
};

export default CreateToken;
