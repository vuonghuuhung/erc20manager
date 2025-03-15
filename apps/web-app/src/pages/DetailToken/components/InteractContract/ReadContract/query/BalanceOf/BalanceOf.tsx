import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useReadContract } from "wagmi";
import { ERC20Manager__factory } from "@repo/contracts";
import { useState } from "react";
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
import { handleConvertToToken } from "@/utils/convertNumber";
import useTokenDetailStore from "@/store/tokenDetailState";

type BalanceOfType = Pick<ReadContractType, "balanceOf">;
const balanceSchema = contractSchema.pick({
  balanceOf: true,
});

const BalanceOf = () => {
  const [addressSearch, setAddressSearch] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const form = useForm<BalanceOfType>({
    resolver: zodResolver(balanceSchema),
    defaultValues: {
      balanceOf: "",
    },
  });
  const {
    data: balanceToken,
    isLoading: isGetBalance,
    error,
  } = useReadContract({
    abi: ERC20Manager__factory.abi,
    address: id as `0x${string}`,
    functionName: "balanceOf",
    args: [addressSearch as `0x${string}`],
    query: {
      enabled: !!addressSearch,
    },
  });

  const { tokenDetail } = useTokenDetailStore();

  async function onSubmit(values: BalanceOfType) {
    setAddressSearch(values.balanceOf);
  }

  return (
    <Collapsible className="border-[#e9ecef] border rounded-xl overflow-hidden mb-2">
      <CollapsibleTrigger className="w-full text-left bg-[#f8f9fa] py-1 px-3">
        balanceOf
      </CollapsibleTrigger>
      <CollapsibleContent className="py-2 px-3">
        <div className="text-[12px] mb-1">who (address)</div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="balanceOf"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Balance"
                        {...field}
                        className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="!mt-4">Query</Button>
            </form>
          </Form>
          {isGetBalance && <LoadingQuery />}
          {balanceToken !== undefined && (
            <div className="mt-2">
              Response: {handleConvertToToken(balanceToken)}{" "}
              {tokenDetail?.symbol}
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 text-sm font-medium text-destructive">
            {error.shortMessage}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BalanceOf;
