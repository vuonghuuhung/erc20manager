import { useWatchContractEvent } from "wagmi";
import { MultisigDAO__factory } from "@repo/contracts";
import { toast, type ExternalToast } from "sonner";
import { AbiEvent, Log } from "viem";

interface useWatchEventDAOProps {
  id: `0x${string}`;
  refetchStatusProposal?: () => void;
  refetchProposalCreated?: () => void;
  isOwner: boolean;
}

const useWatchEventDAO = ({
  id,
  refetchStatusProposal,
  refetchProposalCreated,
  isOwner,
}: useWatchEventDAOProps) => {
  useWatchContractEvent({
    address: id,
    abi: MultisigDAO__factory.abi as unknown as AbiEvent[],
    onLogs(logs: Log<bigint, number, false, AbiEvent, true, AbiEvent[]>[]) {
      console.log('isOwner event', isOwner);
      
      if (!isOwner) return;

      logs.forEach((log) => {
        const toastConfig: ExternalToast = {
          position: "top-right" as const,
          className: "text-green-400",
        };

        switch (log.eventName) {
          case "Submit":
            refetchProposalCreated?.();
            toast.success("New proposal has been created", toastConfig);
            break;
          case "Approve":
            refetchStatusProposal?.();
            toast.success("Proposal has been approved", toastConfig);
            break;
          case "Revoke":
            refetchStatusProposal?.();
            toast.success("Proposal has been rejected", toastConfig);
            break;
          case "Execute":
            refetchStatusProposal?.();
            toast.success("Proposal has been executed", toastConfig);
            break;
        }
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong");
    },
  });
};

export default useWatchEventDAO;
