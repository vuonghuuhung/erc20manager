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
import { FC, useEffect } from "react";
import { useContractWrite } from "@/hooks/useContracts";
import ConnectButtonCustom from "@/components/ConnectButtonCustom/ConnectButtonCustom";
import ModalStep, { MODAL_STEP } from "@/components/ModalStep/ModalStep";
import { pinata } from "@/utils/http";
import { DECIMALS, initialDAOCreate } from "@/constants/token";
import { ethers } from "ethers";
import { DAOFactory__factory } from "@repo/contracts";
import { contractAddress, pinataIdGroup } from "@/config/config";

export type DAOTokenInfoSchemaType = Pick<
  CreateDAOContractSchemaType,
  "amount" | "symbol" | "nameToken"
>;
const DAOTokenInfoSchema = createDAOContractSchema.pick({
  amount: true,
  symbol: true,
  nameToken: true,
});
const DAOTokenInfo: FC<{
  dataSubmit: CreateDAOContractSchemaType;
  handleUpdateStep: (step: number, data: DAOTokenInfoSchemaType | undefined) => void;
}> = ({ dataSubmit, handleUpdateStep }) => {
  const form = useForm<DAOTokenInfoSchemaType>({
    resolver: zodResolver(DAOTokenInfoSchema),
    defaultValues: {
      amount: "",
      symbol: "",
      nameToken: "",
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

  async function onSubmit(values: DAOTokenInfoSchemaType) {
    const dataSend = { ...dataSubmit, ...values };
    const amountValue = ethers.parseUnits(dataSend.amount, DECIMALS);
    try {
      setStepModal(MODAL_STEP.PROCESSING);
      setErrorWrite("");
      const upload = await pinata.upload.public
        .file(dataSend.avatarFile)
        .group(pinataIdGroup.DAOImageIdGroup);
        console.log("upload", upload);
        
      const gatewayUrlImg = await pinata.gateways.public.convert(upload.cid);
      console.log("gatewayUrlImg", gatewayUrlImg);
      const uploadDataJson = await pinata.upload.public
        .json({
          name: dataSend.nameDAO,
          description: dataSend.descriptionDao,
          image: gatewayUrlImg,
        })
        .group(pinataIdGroup.DAOInfoIdGroup);

      const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["string"],
        [uploadDataJson.cid]
      );

      await write({
        args: [
          dataSend.listAddress,
          dataSend.requireVote,
          dataSend.nameToken,
          dataSend.symbol,
          DECIMALS,
          amountValue,
          encodedData,
        ],
        functionName: "createDAO",
        abi: DAOFactory__factory.abi,
        contractAddress: contractAddress.DAOFactoryAddress,
      });
    } catch (error) {
      console.log("error", { error });
      if (!errorWrite) {
        setStepModal(MODAL_STEP.FAILED);
        setErrorWrite("Something went wrong, please try again later");
      }
    }
  }

  const amountWatch = form.watch("amount");
  const symbolWatch = form.watch("symbol");
  const nameTokenWatch = form.watch("nameToken");

  const handleGoBack = () => {
    handleUpdateStep(2, {
      amount: amountWatch,
      symbol: symbolWatch,
      nameToken: nameTokenWatch,
    });
  };

  useEffect(() => {
    form.setValue("amount", dataSubmit.amount);
    form.setValue("symbol", dataSubmit.symbol);
    form.setValue("nameToken", dataSubmit.nameToken);
  }, [dataSubmit, form]);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">
          Token Configuration
        </h2>
        <p className="text-sm text-gray-400">
          Set up the governance token for your DAO
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nameToken"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Token name"
                        {...field}
                        className="block w-full pl-4 pr-12 py-3 h-12 text-white rounded-xl bg-gray-800/50 text-base font-medium border border-gray-700/50 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Token symbol"
                        {...field}
                        className="block w-full pl-4 pr-12 py-3 h-12 text-white rounded-xl bg-gray-800/50 text-base font-medium border border-gray-700/50 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputNumber
                      placeholder="Token amount"
                      {...field}
                      classNameInput="block w-full pl-4 pr-12 py-3 h-12 text-white rounded-xl bg-gray-800/50 text-base font-medium border border-gray-700/50 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            {isConnected ? (
              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  onClick={handleGoBack}
                  className="flex-1 bg-gray-800/50 text-white rounded-xl py-3 font-semibold hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity"
                >
                  Create DAO
                </Button>
              </div>
            ) : (
              <ConnectButtonCustom />
            )}
          </div>
        </form>
      </Form>

      <ModalStep
        open={stepModal !== MODAL_STEP.READY}
        setOpen={setStepModal}
        contentStep={errorWrite}
        statusStep={stepModal}
      
      handleClose={() => handleUpdateStep(1, initialDAOCreate)}
      />
    </div>
  );
};

export default DAOTokenInfo;
