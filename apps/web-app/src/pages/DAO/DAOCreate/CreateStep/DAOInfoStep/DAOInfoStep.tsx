import { CircleX } from "lucide-react";
import InputFile from "@/components/InputFile/InputFile";
import { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CreateDAOContractSchemaType,
  createDAOContractSchema,
} from "@/utils/Rules";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type CreateDAOInfoSchemaType = Pick<
  CreateDAOContractSchemaType,
  "descriptionDao" | "nameDAO" | "avatarFile"
>;
const createDAOInfoSchema = createDAOContractSchema.pick({
  nameDAO: true,
  descriptionDao: true,
  avatarFile: true,
});

const DAOInfoStep: FC<{
  dataSubmit: CreateDAOContractSchemaType;
  handleUpdateStep: (step: number, data: CreateDAOInfoSchemaType) => void;
}> = ({ handleUpdateStep, dataSubmit }) => {
  const [file, setFile] = useState<File>();
  const form = useForm<CreateDAOInfoSchemaType>({
    resolver: zodResolver(createDAOInfoSchema),
    defaultValues: {
      nameDAO: "",
      descriptionDao: "",
      avatarFile: undefined,
    },
  });

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);

  const handleChangeFile = (file?: File) => {
    setFile(file);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue("avatarFile", file as any);
    if (file) {
      form.clearErrors("avatarFile");
    }
  };

  async function onSubmit(values: CreateDAOInfoSchemaType) {
    handleUpdateStep(2, values);
  }

  useEffect(() => {
    form.setValue("nameDAO", dataSubmit.nameDAO);
    form.setValue("descriptionDao", dataSubmit.descriptionDao);
    if (dataSubmit.avatarFile) {
      setFile(dataSubmit.avatarFile);
      form.setValue("avatarFile", dataSubmit.avatarFile);
    }
  }, [dataSubmit, form]);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">
          Basic Information
        </h2>
        <p className="text-sm text-gray-400">
          Start by providing some basic information about your DAO
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-2 border-solid border-gray-600 flex items-center justify-center overflow-hidden bg-gray-800/50">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="text-gray-400 text-sm">Upload Logo</div>
                      <div className="text-gray-500 text-xs mt-1">
                        Recommended: 400x400px
                      </div>
                    </div>
                  )}
                </div>
                {previewImage && (
                  <button
                    type="button"
                    onClick={() => handleChangeFile(undefined)}
                    className="absolute -top-1 -right-1 bg-red-500/10 text-red-500 rounded-full p-1 hover:bg-red-500/20 transition-colors"
                  >
                    <CircleX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <InputFile onChange={handleChangeFile} />
            </div>
            {form.formState.errors.avatarFile && (
              <div className="mt-2 text-sm font-medium text-destructive">
                {form.formState.errors.avatarFile?.message}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nameDAO"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-white">
                    DAO Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Give your DAO a name"
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
              name="descriptionDao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-white mb-1">
                    DAO Description
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Give your DAO a description"
                        {...field}
                        className="block w-full resize-none pl-4 pr-12 py-3 h-12 text-white rounded-xl bg-gray-800/50 text-base font-medium border border-gray-700/50 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DAOInfoStep;
