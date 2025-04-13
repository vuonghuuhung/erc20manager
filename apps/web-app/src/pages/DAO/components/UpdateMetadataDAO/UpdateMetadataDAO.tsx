import { CircleX, Edit } from "lucide-react";
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
import { ProposalAction } from "@/constants/token";
import { useContractWrite } from "@/hooks/useContracts";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import ConnectButtonCustom from "@/components/ConnectButtonCustom/ConnectButtonCustom";
import { Textarea } from "@/components/ui/textarea";
import { MultisigDAO__factory } from "@repo/contracts";
import { useParams } from "react-router-dom";
import { pinata } from "@/utils/http";
import ModalStep, { MODAL_STEP } from "@/components/ModalStep/ModalStep";
import BoxContent from "@/components/BoxContent";
import InputFile from "@/components/InputFile/InputFile";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  createDAOContractSchema,
  CreateDAOContractSchemaType,
} from "@/utils/Rules";
import { pinataIdGroup } from "@/config/config";

export type CreateDAOInfoSchemaType = Pick<
  CreateDAOContractSchemaType,
  "descriptionDao" | "nameDAO" | "avatarFile"
> & {
  descriptionProposal: string;
};
const createDAOInfoSchema = createDAOContractSchema.pick({
  nameDAO: true,
  descriptionDao: true,
  avatarFile: true,
  descriptionProposal: true,
});

const UpdateMetadataDAO = () => {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File>();

  const form = useForm<CreateDAOInfoSchemaType>({
    resolver: zodResolver(createDAOInfoSchema),
    defaultValues: {
      descriptionDao: "",
      nameDAO: "",
      avatarFile: undefined,
      descriptionProposal: "",
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

  const {
    write,
    stepModal,
    errorWrite,
    setStepModal,
    setErrorWrite,
    isConnected,
  } = useContractWrite();

  async function onSubmit(values: CreateDAOInfoSchemaType) {
    try {
      setStepModal(MODAL_STEP.PROCESSING);
      setErrorWrite("");

      const upload = await pinata.upload.public
        .file(values.avatarFile)
        .group(pinataIdGroup.DAOImageIdGroup);
      const gatewayUrlImg = await pinata.gateways.public.convert(upload.cid);
      const uploadDataJson = await pinata.upload.public
        .json({
          name: values.nameDAO,
          description: values.descriptionDao,
          image: gatewayUrlImg,
        })
        .group(pinataIdGroup.DAOInfoIdGroup);

      const uploadProposalDescriptionJson = await pinata.upload.public
        .json({
          description: values.descriptionProposal,
        })
        .group(pinataIdGroup.ProposalDesIdGroup);

      const encodedDataProposalDescription = ethers.AbiCoder.defaultAbiCoder().encode(
        ["string"],
        [uploadProposalDescriptionJson.cid]
      );

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
          0,
          ProposalAction.UpdateMetadata,
          encodedData,
          encodedDataProposalDescription,
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
    <BoxContent extendClassName="p-8 bg-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-900/50 rounded-xl">
          <Edit className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Update DAO Metadata</h2>
      </div>

      <div>
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
                          className="block resize-none w-full pl-4 pr-12 py-3 h-12 text-white rounded-xl bg-gray-800/50 text-base font-medium border border-gray-700/50 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionProposal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-white mb-1">
                      Proposal Description
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Give your DAO a description"
                          {...field}
                          className="block resize-none w-full pl-4 pr-12 py-3 h-12 text-white rounded-xl bg-gray-800/50 text-base font-medium border border-gray-700/50 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
      />
    </BoxContent>
  );
};

export default UpdateMetadataDAO;
