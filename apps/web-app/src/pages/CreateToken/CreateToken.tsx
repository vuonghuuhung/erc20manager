import BoxContent from "@/components/BoxContent";
import { createTokenSchema, CreateTokenType } from "@/utils/Rules";
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
import { DECIMALS } from "@/constants/token";
import { ERC20Factory__factory } from "@repo/contracts";
import { contractAddress } from "@/config/config";
import { Coins, Component, CircleDollarSign } from "lucide-react";

const CreateToken = () => {
  const { write, stepModal, errorWrite, setStepModal, isConnected } =
    useContractWrite();
  const form = useForm<CreateTokenType>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      name: "",
      symbol: "",
      amount: "",
    },
  });

  async function onSubmit(values: CreateTokenType) {
    try {
      const { name, symbol, amount } = values;
      const amountValue = ethers.parseUnits(amount, DECIMALS);

      await write({
        args: [name, symbol, amountValue],
        functionName: "mintERC20",
        abi: ERC20Factory__factory.abi,
        contractAddress: contractAddress.ERC20FactoryAddress,
      });
    } catch (error) {
      console.log("error", { error });
    }
  }

  return (
    <div className="pt-8 flex items-center justify-center">
      <BoxContent extendClassName="p-6 w-full max-w-[462px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Coins className="w-8 h-8 text-primary" />
          <h3 className="text-2xl font-bold text-primary">Create Your Token</h3>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Token Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter token name"
                          {...field}
                          className="pl-10 h-11 bg-background border border-input hover:border-primary transition-colors"
                        />
                        <Component className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
                    <FormLabel className="text-sm font-medium">
                      Token Symbol
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter token symbol"
                          {...field}
                          className="pl-10 h-11 bg-background border border-input hover:border-primary transition-colors"
                        />
                        <Coins className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
                    <FormLabel className="text-sm font-medium">
                      Initial Supply
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <InputNumber
                          min={4}
                          max={5}
                          placeholder="Enter initial supply"
                          {...field}
                          className="pl-10"
                        />
                        <CircleDollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isConnected ? (
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                >
                  Create Token
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
        handleClose={() => form.reset()}
      />
    </div>
  );
};

export default CreateToken;
