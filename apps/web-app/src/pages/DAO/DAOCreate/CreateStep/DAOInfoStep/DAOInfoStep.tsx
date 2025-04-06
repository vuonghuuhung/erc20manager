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
  FormMessage,
} from "@/components/ui/form";
import {
  CreateDAOContractSchemaType,
  createDAOContractSchema,
} from "@/utils/Rules";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  };

  async function onSubmit(values: CreateDAOInfoSchemaType) {
    handleUpdateStep(2, {
      ...values,
      avatarFile: file,
    });
    // try {
    //   setIsLoading(true);
    //   if (file) {
    //     const upload = await pinata.upload.public
    //       .file(file)
    //       .group("87de2c19-9d65-4cff-9fd1-08a426a68411");
    //     console.log(upload);
    //     const gatewayUrlImg = await pinata.gateways.public.convert(upload.cid);
    //     const uploadDataJson = await pinata.upload.public
    //       .json({
    //         name: values.nameDAO,
    //         description: values.descriptionDao,
    //         image: gatewayUrlImg,
    //       })
    //       .group("eda38d13-ccf0-4bf8-bddd-43245a3851c1");
    //     setIsLoading(false);
    //     if (uploadDataJson) {
    //       handleUpdateStep(2, {
    //         ...values,
    //         avatarFile: file,
    //         avatarUpload: uploadDataJson.cid,
    //       });
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    //   setIsLoading(false);
    //   toast.error("Something went wrong");
    // }
  }

  useEffect(() => {
    form.setValue("nameDAO", dataSubmit.nameDAO);
    form.setValue("descriptionDao", dataSubmit.descriptionDao);
    if (dataSubmit.avatarFile) {
      setFile(dataSubmit.avatarFile);
    }
  }, [dataSubmit, form]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="text-[20px] mb-4 font-medium text-[#223354b3]">
            DAO information
          </div>
          <div className="h-[192px] relative">
            {file && (
              <button
                onClick={() => setFile(undefined)}
                className="absolute top-4 right-5"
              >
                <CircleX />
              </button>
            )}
            {file ? (
              <img
                src={previewImage}
                alt="img"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full">
                <InputFile onChange={handleChangeFile} />
                <div className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.avatarFile?.message}
                </div>
              </div>
            )}
          </div>
          <div className="mt-[40px]">
            <FormField
              control={form.control}
              name="nameDAO"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Give your DAO a name"
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
              name="descriptionDao"
              render={({ field }) => (
                <FormItem className="!mt-4">
                  <FormControl>
                    <Input
                      placeholder="Give your DAO a description"
                      {...field}
                      className="block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none"
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
        </form>
      </Form>
    </div>
  );
};

export default DAOInfoStep;
