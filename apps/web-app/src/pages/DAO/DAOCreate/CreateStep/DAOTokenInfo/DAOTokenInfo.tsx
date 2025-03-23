import InputNumber from "@/components/InputNumber";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createDAOContractSchema,
  CreateDAOContractSchemaType,
} from "@/utils/Rules";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";

export type DAOTokenInfoSchemaType = Pick<
  CreateDAOContractSchemaType,
  "amount" | "decimals" | "symbol" | "nameToken"
>;
const DAOTokenInfoSchema = createDAOContractSchema.pick({
  amount: true,
  decimals: true,
  symbol: true,
  nameToken: true,
});
const DAOTokenInfo: FC<{
  dataSubmit: CreateDAOContractSchemaType;
}> = ({  dataSubmit }) => {
  const form = useForm<DAOTokenInfoSchemaType>({
    resolver: zodResolver(DAOTokenInfoSchema),
    defaultValues: {
      amount: "",
      decimals: "",
      symbol: "",
      nameToken: "",
    },
  });

  async function onSubmit(values: DAOTokenInfoSchemaType) {
    const dataSend = {...dataSubmit, ...values}
    console.log(dataSend);
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="text-[20px] font-medium text-[#223354b3]">
              DAO Token information
            </div>
            <FormField
              control={form.control}
              name="nameToken"
              render={({ field }) => (
                <FormItem className="!mt-4">
                  <FormControl>
                    <Input
                      placeholder="Token name"
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
          </div>
          <div className="flex justify-end items-center mt-4">
            <Button className="w-[120px]">Continue</Button>
          </div>
          {/* <div className="mt-8 w-[400px] mx-auto">
            {isConnected ? (
              <Button type="submit" className="block w-full">
                Submit
              </Button>
            ) : (
              <ConnectButtonCustom />
            )}
          </div> */}
        </form>
      </Form>
    </div>
  );
};

export default DAOTokenInfo;
