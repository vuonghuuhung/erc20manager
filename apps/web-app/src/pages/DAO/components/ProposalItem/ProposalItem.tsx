import IconRejected from "@/assets/icons/IconRejected";
import IconPassed from "@/assets/icons/IconPassed";
import { Clock, Loader2 } from "lucide-react";
import { UserCheck } from "lucide-react";
import { ProposalStatus } from "@/constants/token";
import { Button } from "@/components/ui/button";
import { useContractWrite } from "@/hooks/useContracts";
import ModalStep, { MODAL_STEP } from "@/components/ModalStep/ModalStep";
import { MultisigDAO__factory } from "@repo/contracts";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import path from "@/constants/path";
interface ProposalItemProps {
  idProposal: number;
  description?: string;
  status?: ProposalStatus;
  isOwner?: boolean;
  isApproved?: boolean;
  isRejected?: boolean;
}

const ProposalItem = ({
  description,
  idProposal,
  status,
  isOwner,
  isApproved,
  isRejected,
}: ProposalItemProps) => {
  const { idDao } = useParams<{ idDao: `0x${string}` }>();
  const {
    write,
    stepModal,
    errorWrite,
    setStepModal,
    methodName,
    isWriteSuccess,
    setErrorWrite,
    isConnected,
  } = useContractWrite("", path.DAODetail);
  const [messageSuccess, setMessageSuccess] = useState<string>("");

  const handleApprove = async () => {
    try {
      setMessageSuccess("Approved proposal successfully");
      await write({
        abi: MultisigDAO__factory.abi,
        contractAddress: idDao,
        functionName: "approveProposal",
        args: [idProposal],
        messageInitial: "Approving proposal...",
        methodName: "Approve proposal",
      });
    } catch (error) {
      console.log("error", { error });
    }
  };

  const handleReject = async () => {
    try {
      setMessageSuccess("Rejected proposal successfully");
      await write({
        abi: MultisigDAO__factory.abi,
        contractAddress: idDao,
        functionName: "rejectProposal",
        args: [idProposal],
        messageInitial: "Rejecting proposal...",
        methodName: "Reject proposal",
      });
    } catch (error) {
      console.log("error", { error });
    }
  };

  const handleExecute = async () => {
    try {
      setMessageSuccess("Executed proposal successfully");
      await write({
        abi: MultisigDAO__factory.abi,
        contractAddress: idDao,
        functionName: "executeProposal",
        args: [idProposal],
        messageInitial: "Executing proposal...",
        methodName: "Execute proposal",
      });
    } catch (error) {
      console.log("error", { error });
    }
  };

  useEffect(() => {
    if (isWriteSuccess) {
      setErrorWrite(messageSuccess);
    }
  }, [isWriteSuccess, setErrorWrite]);

  return (
    <div className="flex mt-2 px-3 items-center bg-[#f3f6f80d] rounded-md cursor-pointer transition duration-300 hover:bg-[#f3f6f81a]">
      <Link
        to={`/dao/detail/${idDao}/proposal/${idProposal}`}
        className="flex-1 h-12 flex-row items-center gap-6 flex"
      >
        <p className="shrink-0 font-mono text-[12px] text-[#f3f6f880]">
          {idProposal}
        </p>
        <div className="w-20 shrink-0">
          {status === ProposalStatus.OnVoting && (
            <div className="link-text flex flex-row items-center gap-1.5">
              <Clock className="w-5 h-5" />
              <p className="shrink-0 truncate text-current text-[13px]">
                OnVoting
              </p>
            </div>
          )}
          {status === ProposalStatus.Passed && (
            <div className="link-text flex flex-row items-center gap-1.5 text-yellow-400">
              <UserCheck className="w-5 h-5 text-current" />
              <p className="shrink-0 truncate text-current text-[13px]">
                Passed
              </p>
            </div>
          )}
          {status === ProposalStatus.Executed && (
            <div className="link-text flex flex-row items-center gap-1.5 text-[#39a699f2]">
              <IconPassed />
              <p className="shrink-0 truncate text-current text-[13px]">
                Executed
              </p>
            </div>
          )}
          {status === ProposalStatus.Rejected && (
            <div className="link-text flex flex-row items-center gap-1.5 text-[#c73e59f2]">
              <IconRejected />
              <p className="shrink-0 truncate text-current text-[13px]">
                Rejected
              </p>
            </div>
          )}
        </div>
        <div className="flex min-w-0 grow flex-row items-center gap-2">
          <p className="body-text grow text-[14px] text-white truncate">
            {description}
          </p>
        </div>
      </Link>
      <div>
        {isOwner && (
          <div className="caption-text shrink-0 break-words text-right font-mono text-[12px]">
            {status === ProposalStatus.OnVoting && (
              <div>
                {!isRejected && (
                  <Button
                    disabled={isApproved || !isConnected || methodName !== ""}
                    onClick={handleApprove}
                    className={`hover:bg-[#39a699f2] transition-all duration-300 ${(isApproved || methodName === "Approve proposal") && "bg-[#39a699f2]"}`}
                  >
                    Approve
                    {isWriteSuccess &&
                      !isApproved &&
                      methodName === "Approve proposal" && (
                        <Loader2 className="animate-spin text-yellow-400 w-5 h-5 ml-1" />
                      )}
                  </Button>
                )}
                {!isApproved && (
                  <Button
                    disabled={isRejected || !isConnected || methodName !== ""}
                    onClick={handleReject}
                    className={`ml-2 hover:bg-[#c73e59f2] transition-all duration-300 ${(isRejected || methodName === "Reject proposal") && "bg-[#c73e59f2]"}`}
                  >
                    Reject
                    {isWriteSuccess &&
                      !isRejected &&
                      methodName === "Reject proposal" && (
                        <Loader2 className="animate-spin text-yellow-400 w-5 h-5 ml-1" />
                      )}
                  </Button>
                )}
              </div>
            )}
            {status === ProposalStatus.Passed && (
              <Button
                onClick={handleExecute}
                disabled={!isConnected || methodName === "Execute proposal"}
                className={`hover:bg-[#39a699f2] transition-all duration-300 ${methodName === "Execute proposal" && "bg-[#39a699f2]"}`}
              >
                Execute
                {isWriteSuccess && methodName === "Execute proposal" && (
                  <Loader2 className="animate-spin text-yellow-400 w-5 h-5 ml-1" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>
      <ModalStep
        open={stepModal !== MODAL_STEP.READY}
        setOpen={setStepModal}
        contentStep={errorWrite}
        statusStep={stepModal}
      />
    </div>
  );
};

export default ProposalItem;
