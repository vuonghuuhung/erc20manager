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
import { FC, useMemo, useState } from "react";

import { Plus } from "lucide-react";

export type DAOListAddressSchemaType = Pick<
  CreateDAOContractSchemaType,
  "listAddress" | "requireVote"
>;
const DAOListAddressSchema = createDAOContractSchema.pick({
  listAddress: true,
  requireVote: true,
});

const DAOListAddressStep: FC<{
  handleUpdateStep: (step: number, data: DAOListAddressSchemaType) => void;
}> = ({ handleUpdateStep }) => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue("listAddress", listAddress);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="text-[20px] font-medium text-[#223354b3]">
              DAO Member's address
            </div>
            <FormField
              control={form.control}
              name="requireVote"
              render={({ field }) => (
                <FormItem className="!mt-4">
                  <FormControl>
                    <Input
                      placeholder="Vote"
                      {...field}
                      className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4">List member</div>
            <div>
              {listAddress.length > 0 &&
                listAddress.map((item, index) => {
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 mt-4">
                        <Input
                          placeholder={`Address ${index + 1}`}
                          value={item}
                          onChange={(e) => {
                            handleChangeAddress(e.target.value, index);
                          }}
                          className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
                        />
                        <div className="text-sm font-medium text-destructive mt-2">
                          {listAddressError[index]}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAddress(index)}
                        type="button"
                        className="ml-1 p-4"
                      >
                        <svg
                          className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium !h-[1.125rem] !w-[1.125rem] text-icon-secondary css-vubbuv"
                          focusable="false"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          data-testid="CloseIcon"
                        >
                          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={handleAddAddress}
                className="p-2 mt-2 flex items-center hover:bg-primary hover:text-white transition-all duration-300 rounded-lg"
              >
                <Plus className="w-[20px] h-[20px]" />
                <span>Add a member</span>
              </button>
            </div>
            <div className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.listAddress?.message}
            </div>
          </div>
          <div className="flex justify-end items-center mt-4">
            <Button
              onClick={handleCheckAddress}
              type={isError ? "button" : "submit"}
              className="w-[120px]"
            >
              Continue
            </Button>
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

export default DAOListAddressStep;
