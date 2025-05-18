import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useReadContract } from "wagmi";
import { ERC20Template__factory } from "@repo/contracts";
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

type AllowanceType = Pick<ReadContractType, "ownerAddress" | "spenderAddress">;
const allowanceSchema = contractSchema.pick({
  ownerAddress: true,
  spenderAddress: true,
});
const Allowance = () => {
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [spenderAddress, setSpenderAddress] = useState<string>("");
  const { tokenDetail } = useTokenDetailStore();
  const { id } = useParams<{ id: string }>();
  const form = useForm<AllowanceType>({
    resolver: zodResolver(allowanceSchema),
    defaultValues: {
      ownerAddress: "",
      spenderAddress: "",
    },
  });
  const { data, isLoading, error } = useReadContract({
    abi: ERC20Template__factory.abi,
    address: id as `0x${string}`,
    functionName: "allowance",
    args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
    query: {
      enabled: !!ownerAddress && !!spenderAddress,
    },
  });

  async function onSubmit(values: AllowanceType) {
    setOwnerAddress(values.ownerAddress);
    setSpenderAddress(values.spenderAddress);
  }

  return (
    <Collapsible className="border-[#e9ecef] border rounded-xl overflow-hidden mb-2">
      <CollapsibleTrigger className="w-full text-left bg-[#f8f9fa] py-1 px-3 border-b border-b-[#e9ecef]">
        allowance
      </CollapsibleTrigger>
      <CollapsibleContent className="py-2 px-3">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="text-[12px] mb-1 mt-2">_owner (address)</div>
              <FormField
                control={form.control}
                name="ownerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="_owner"
                        {...field}
                        className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-[12px] mb-1 mt-2">_spender (address)</div>
              <FormField
                control={form.control}
                name="spenderAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="_spender"
                        {...field}
                        className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="!mt-4" disabled={isLoading}>Query</Button>
            </form>
          </Form>
          {isLoading && <LoadingQuery />}
          {data !== undefined && (
            <div className="mt-2">
              Response: {handleConvertToToken(data)} {tokenDetail?.symbol}
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

export default Allowance;
