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
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import ConnectButtonCustom from "@/components/ConnectButtonCustom/ConnectButtonCustom";
import InputNumber from "@/components/InputNumber";
import { Textarea } from "@/components/ui/textarea";
import { MultisigDAO__factory } from "@repo/contracts";
import { useNavigate, useParams } from "react-router-dom";
import { pinata } from "@/utils/http";
import ModalStep, { MODAL_STEP } from "@/components/ModalStep/ModalStep";
import BoxContent from "@/components/BoxContent";
import { Flame } from "lucide-react";
import * as z from "zod";
import { pinataIdGroup } from "@/config/config";
import path from "@/constants/path";

const burnProposalSchema = z.object({
  amount: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  description: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
});

type BurnProposalType = z.infer<typeof burnProposalSchema>;

const BurnProposal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const form = useForm<BurnProposalType>({
    resolver: zodResolver(burnProposalSchema),
    defaultValues: {
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
  } = useContractWrite("Burn Token", path.DAODetail);

  async function onSubmit(values: BurnProposalType) {
    try {
      setStepModal(MODAL_STEP.PROCESSING);
      setErrorWrite("");
      const { amount, description } = values;
      const amountValue = ethers.parseUnits(amount, DECIMALS);

      const uploadDataJson = await pinata.upload.public
        .json({
          description: description,
        })
        .group(pinataIdGroup.ProposalDesIdGroup);

      const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["string"],
        [uploadDataJson.cid]
      );

      await write({
        abi: MultisigDAO__factory.abi,
        contractAddress: id,
        functionName: "submitProposal",
        args: [
          ethers.ZeroAddress,
          amountValue,
          ProposalAction.Burn,
          "",
          encodedData,
        ],
      });
    } catch (error) {
      console.log("error", { error });
      if (!errorWrite) {
        setStepModal(MODAL_STEP.FAILED);
        setErrorWrite("Something went wrong, please try again later");
      }
    }
  }

  return (
    <BoxContent extendClassName="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 rounded-xl">
          <Flame className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#223354]">Burn Tokens</h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
      </div>

      <ModalStep
        open={stepModal !== MODAL_STEP.READY}
        setOpen={setStepModal}
        contentStep={errorWrite}
        statusStep={stepModal}
        handleClose={() => navigate(path.DAODashboard)}
      />
    </BoxContent>
  );
};

export default BurnProposal;
