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
import { DECIMALS } from "@/constants/token";
import { ethers } from "ethers";
import { DAOFactory__factory } from "@repo/contracts";
import { contractAddress } from "@/config/config";

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
  handleUpdateStep: (step: number, data: DAOTokenInfoSchemaType) => void;
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
        .group("87de2c19-9d65-4cff-9fd1-08a426a68411");
      const gatewayUrlImg = await pinata.gateways.public.convert(upload.cid);
      const uploadDataJson = await pinata.upload.public
        .json({
          name: dataSend.nameDAO,
          description: dataSend.descriptionDao,
          image: gatewayUrlImg,
        })
        .group("eda38d13-ccf0-4bf8-bddd-43245a3851c1");
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
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log(errors)
          )}
          className="space-y-8"
        >
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
          <div className="mt-8 mx-auto">
            {isConnected ? (
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={handleGoBack}
                  type="button"
                  className="w-[120px]"
                >
                  Back
                </Button>
                <Button className="w-[120px]">Continue</Button>
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
      />
    </div>
  );
};

export default DAOTokenInfo;
