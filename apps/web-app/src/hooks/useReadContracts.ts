import { contractAddress } from "@/config/config";
import { config } from "@/main";
import {
  DAOFactory__factory,
  ERC20Factory__factory,
  MultisigDAO__factory,
} from "@repo/contracts";
import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";

export const useGetListOfERC20 = () => {
  return useQuery({
    queryKey: ["getListOfERC20Created"],
    queryFn: async () =>
      await readContract(config, {
        address: contractAddress.ERC20FactoryAddress,
        abi: ERC20Factory__factory.abi,
        functionName: "getListOfERC20Created",
        args: [],
      }),
  });
};

export const useGetListDAO = () => {
  return useQuery({
    queryKey: ["getListOfDAO"],
    queryFn: async () =>
      await readContract(config, {
        address: contractAddress.DAOFactoryAddress,
        abi: DAOFactory__factory.abi,
        functionName: "getListOfDAO",
        args: [],
      }),
  });
};

export const useGetProposalDetail = (
  id: bigint,
  contractAddress: `0x${string}`
) => {
  return useQuery({
    queryKey: ["getProposalDetail"],
    queryFn: async () =>
      await readContract(config, {
        address: contractAddress,
        abi: MultisigDAO__factory.abi,
        functionName: "getProposalDetails",
        args: [id],
      }),
  });
};
