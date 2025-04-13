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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FC, useEffect, useMemo, useState } from "react";

import { CircleX, Plus } from "lucide-react";
import InputNumber from "@/components/InputNumber";

export type DAOListAddressSchemaType = Pick<
  CreateDAOContractSchemaType,
  "listAddress" | "requireVote"
>;
const DAOListAddressSchema = createDAOContractSchema.pick({
  listAddress: true,
  requireVote: true,
});

const DAOListAddressStep: FC<{
  dataSubmit: CreateDAOContractSchemaType;
  handleUpdateStep: (step: number, data: DAOListAddressSchemaType) => void;
}> = ({ handleUpdateStep, dataSubmit }) => {
  const form = useForm<DAOListAddressSchemaType>({
    resolver: zodResolver(DAOListAddressSchema),
    defaultValues: {
      requireVote: "",
      listAddress: [],
    },
  });

  const [listAddress, setListAddress] = useState<string[]>([]);
  const [listAddressError, setListAddressError] = useState<string[]>([]);

  const isError = useMemo(() => {
    return listAddressError.some((item) => item !== "");
  }, [listAddressError]);

  const handleChangeAddress = (value: string, index: number) => {
    const newListAddress = [...listAddress];
    newListAddress[index] = value;
    setListAddress(newListAddress);
    if (value !== "") {
      setListAddressError((prev) => {
        const newPrev = [...prev];
        newPrev[index] = "";
        return newPrev;
      });
    } else {
      setListAddressError((prev) => {
        const newPrev = [...prev];
        newPrev[index] = "Field is required";
        return newPrev;
      });
    }
  };

  const handleAddAddress = () => {
    setListAddress([...listAddress, ""]);
    setListAddressError([...listAddressError, ""]);
  };

  const handleRemoveAddress = (index: number) => {
    const newListAddress = [...listAddress];
    const newListAddressError = [...listAddressError];
    newListAddress.splice(index, 1);
    newListAddressError.splice(index, 1);

    setListAddress(newListAddress);
    setListAddressError(newListAddressError);
  };

  async function onSubmit(values: DAOListAddressSchemaType) {
    if (Number(values.requireVote) > listAddress.length) {
      form.setError("requireVote", {
        type: "manual",
        message:
          "Number of votes must be less than or equal to the number of members",
      });
      return;
    }
    handleUpdateStep(3, values);
  }

  const handleCheckAddress = () => {
    if (listAddress.length > 0) {
      listAddress.forEach((item, index) => {
        if (item === "") {
          setListAddressError((prev) => {
            const newPrev = [...prev];
            newPrev[index] = "Field is required";
            return newPrev;
          });
        }
      });
    }
    if (
      listAddress.length >= 0 &&
      listAddressError.every((item) => item === "")
    ) {
      form.setValue("listAddress", listAddress);
    }
  };

  const listAddressWatch = form.watch("listAddress");
  const requireVoteWatch = form.watch("requireVote");

  const handleGoBack = () => {
    handleUpdateStep(1, {
      listAddress: listAddressWatch,
      requireVote: requireVoteWatch,
    });
  };

  useEffect(() => {
    form.setValue("listAddress", dataSubmit.listAddress);
    form.setValue("requireVote", dataSubmit.requireVote);
    if (dataSubmit.listAddress.length > 0) {
      setListAddress(dataSubmit.listAddress);
    }
  }, [dataSubmit, form]);

  useEffect(() => {
    form.setValue("listAddress", listAddress);
  }, [listAddress, form]);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">
          Configure Members
        </h2>
        <p className="text-sm text-gray-400">
          Add member addresses and set up voting requirements for your DAO
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <FormField
              control={form.control}
              name="requireVote"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputNumber
                      placeholder="Number of votes required"
                      {...field}
                      classNameInput="block w-full pl-4 pr-12 py-3 h-12 text-white rounded-xl bg-gray-800/50 text-base font-medium border border-gray-700/50 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">
                Member Addresses
              </h3>
              <button
                type="button"
                onClick={handleAddAddress}
                className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </div>

            {listAddress.length > 0 && (
              <div className="space-y-3">
                {listAddress.map((item, index) => (
                  <div key={index} className="relative">
                    <Input
                      placeholder={`Member address ${index + 1}`}
                      value={item}
                      onChange={(e) =>
                        handleChangeAddress(e.target.value, index)
                      }
                      className="block w-full pl-4 pr-12 py-3 h-12 text-white rounded-xl bg-gray-800/50 text-base font-medium border border-gray-700/50 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(index)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <CircleX className="w-5 h-5" />
                    </button>
                    {listAddressError[index] && (
                      <p className="mt-1.5 text-sm text-red-400">
                        {listAddressError[index]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {form.formState.errors.listAddress?.message && (
              <p className="text-sm text-red-400">
                {form.formState.errors.listAddress?.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <Button
              type="button"
              onClick={handleGoBack}
              className="flex-1 bg-gray-800/50 text-white rounded-xl py-3 font-semibold hover:bg-gray-700/50 transition-colors border border-gray-700/50"
            >
              Back
            </Button>
            <Button
              onClick={handleCheckAddress}
              type={isError ? "button" : "submit"}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DAOListAddressStep;
