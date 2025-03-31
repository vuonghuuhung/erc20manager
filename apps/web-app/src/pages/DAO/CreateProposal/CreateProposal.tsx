import BoxContent from "@/components/BoxContent";
import {
  createProposalSchema,
  CreateProposalType,
  createTokenSchema,
  CreateTokenType,
} from "@/utils/Rules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputNumber from "@/components/InputNumber";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConnectButtonCustom from "@/components/ConnectButtonCustom/ConnectButtonCustom";
import { ethers } from "ethers";
import ModalStep, { MODAL_STEP } from "@/components/ModalStep/ModalStep";
import { useContractWrite } from "@/hooks/useContracts";
import useDaoTokenInfoStore from "@/store/daoTokenInfo";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useContractDetail from "@/hooks/useContractDetail";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading/Loading";

const CreateProposal = () => {
  const { write, stepModal, errorWrite, setStepModal, isConnected } =
    useContractWrite({
      functionName: "mintERC20",
    });
  const form = useForm<CreateProposalType>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      action: "mint",
      addressReceive: "",
      amount: "",
      description: "",
    },
  });

  const { id } = useParams<{ id: string }>();
  const {
    data: infoToken,
    isLoading: isLoadingInfo,
    isErrorContractAddress,
    error,
  } = useContractDetail([id] as `0x${string}`[]);

  async function onSubmit(values: CreateProposalType) {
    console.log("values", values);

    try {
      const { amount } = values;
      const amountValue = ethers.parseUnits(amount, Number(infoToken[0]?.decimals || 18));
      await write([name, symbol, Number(infoToken[0]?.decimals || 18), amountValue]);
    } catch (error) {
      console.log("error", { error });
    }
  }

  return (
    <div>
      <BoxContent extendClassName="p-4 w-full max-w-[462px] mx-auto">
        <h3 className="text-[25px] text-[#223354] font-bold mb-6">
          Create proposal
        </h3>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="addressReceive"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Address"
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
                name="action"
                render={({ field }) => (
                  <FormItem className="!mt-4">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="mint" />
                          </FormControl>
                          <FormLabel className="font-normal">Mint</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="burn" />
                          </FormControl>
                          <FormLabel className="font-normal">Burn</FormLabel>
                        </FormItem>
                      </RadioGroup>
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="!mt-4">
                    <FormControl>
                      <Input
                        placeholder="Description"
                        {...field}
                        className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
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
        contentStep={errorWrite}
        statusStep={stepModal}
      />
      <Loading isLoading={isLoadingInfo} />
    </div>
  );
};

export default CreateProposal;
