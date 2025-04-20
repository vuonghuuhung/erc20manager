import { useWatchContractEvent } from "wagmi";
import { DAOFactory__factory, MultisigDAO__factory } from "@repo/contracts";
import { toast } from "sonner";

import { AbiEvent, Log } from "viem";

interface useWatchEventDAOProps {
  id: `0x${string}`;
  refetchStatusProposal: () => void;
  refetchProposalCreated: () => void;
}

const useWatchEventDAO = ({
  id,
  refetchStatusProposal,
  refetchProposalCreated,
}: useWatchEventDAOProps) => {
  useWatchContractEvent({
    address: id,
    abi: MultisigDAO__factory.abi as unknown as AbiEvent[],
    onLogs(logs: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>[]) {
      logs.forEach((log) => {
        if (log.eventName === "ProposalCreated") {
          refetchStatusProposal();
        }
      });
      console.log("New logs!", logs[0].eventName);
      refetchProposalCreated();
      toast.success("New proposal was created", {
        position: "top-right",
        className: "text-green-400",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong");
    },
  });
};

export default useWatchEventDAO;
