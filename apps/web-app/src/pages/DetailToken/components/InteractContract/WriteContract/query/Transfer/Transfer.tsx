import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { FC } from "react";
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
import { ethers } from "ethers";
import { useTokenWrite } from "@/hooks/useToken";

type TransferType = Pick<ReadContractType, "spenderAddress" | "amount">;
const transferType = contractSchema.pick({
  amount: true,
  spenderAddress: true,
});

const Transfer: FC<{ decimals?: number }> = ({ decimals }) => {
  const { id } = useParams<{ id: `0x${string}` }>();
  const form = useForm<TransferType>({
    resolver: zodResolver(transferType),
    defaultValues: {
      spenderAddress: "",
      amount: "",
    },
  });
  const { write, isLoading, errorWrite, isWriteSuccess } = useTokenWrite({
    functionName: "transfer",
    tokenAddress: id as `0x${string}`,
  });

  async function onSubmit(values: TransferType) {
    try {
      const { amount, spenderAddress } = values;
      const amountValue = ethers.parseUnits(amount, decimals || 18);
      await write([spenderAddress, amountValue]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("co loi o day", { error });
    }
  }

  return (
    <Collapsible className="border-[#e9ecef] border rounded-xl overflow-hidden mb-2">
      <CollapsibleTrigger className="w-full text-left bg-[#f8f9fa] py-1 px-3 border-b border-b-[#e9ecef]">
        transfer
      </CollapsibleTrigger>
      <CollapsibleContent className="py-2 px-3">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="text-[12px] mb-1">_to (address)</div>
              <FormField
                control={form.control}
                name="spenderAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="_to (address)"
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
                        placeholder="_value"
                        {...field}
                        className="block w-full h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="!mt-4" disabled={isLoading}>transfer</Button>
            </form>
          </Form>
          {isLoading && <LoadingQuery />}
          {isWriteSuccess && !isLoading && (
            <div className="mt-2">Response: The transfer has been sent.</div>
          )}
        </div>
        {errorWrite && (
          <div className="mt-2 text-sm font-medium text-destructive">
            {errorWrite}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Transfer;
