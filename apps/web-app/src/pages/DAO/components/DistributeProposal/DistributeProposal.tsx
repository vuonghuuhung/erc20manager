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
import { DECIMALS, ProposalAction } from "@/constants/token";
import { useContractWrite } from "@/hooks/useContracts";
import { createProposalSchema, CreateProposalType } from "@/utils/Rules";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import ConnectButtonCustom from "@/components/ConnectButtonCustom/ConnectButtonCustom";
import InputNumber from "@/components/InputNumber";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultisigDAO__factory } from "@repo/contracts";
import { useParams } from "react-router-dom";
import { pinata } from "@/utils/http";
import ModalStep, { MODAL_STEP } from "@/components/ModalStep/ModalStep";

const DistributeProposal = () => {
  const { id } = useParams<{ id: string }>();
  const form = useForm<CreateProposalType>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      addressReceive: "",
      amount: "",
      description: "",
    },
  });

  const {
    write,
    stepModal,
    errorWrite,
    setStepModal,
    setErrorWrite,
    isConnected,
  } = useContractWrite();

  async function onSubmit(values: CreateProposalType) {
    try {
      setStepModal(MODAL_STEP.PROCESSING);
      setErrorWrite("")
      const { amount, addressReceive, description } = values;
      const amountValue = ethers.parseUnits(amount, DECIMALS);

      const uploadDataJson = await pinata.upload.public
        .json({
          description: description,
        })
        .group("8b567053-d8f8-4d4d-be0e-502f4c121028");
      console.log("uploadDataJson", uploadDataJson);
      const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["string"],
        [uploadDataJson.cid]
      );

      await write({
        abi: MultisigDAO__factory.abi,
        contractAddress: id,
        functionName: "submitProposal",
        args: [
          addressReceive,
          amountValue,
          ProposalAction.Distribute,
          encodedData,
          "",
        ],
      });
    } catch (error) {
      console.log("error", { error });
      if (!errorWrite) {
        setErrorWrite("Something went wrong, please try again later");
      }
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="addressReceive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address receive</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address receive"
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
            name="amount"
            render={({ field }) => (
              <FormItem className="!mt-4">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <InputNumber placeholder="Amount" {...field} />
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
                <FormLabel>Description your proposal</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description your proposal"
                    className="resize-none block w-full border-none p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
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
      <ModalStep
        open={stepModal !== MODAL_STEP.READY}
        setOpen={setStepModal}
        contentStep={errorWrite}
        statusStep={stepModal}
      />
    </div>
  );
};

export default DistributeProposal;
