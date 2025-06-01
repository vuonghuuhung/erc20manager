import IconPassed from "@/assets/icons/IconPassed";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProposalStatus } from "@/constants/token";
import { pinata } from "@/utils/http";
import { MultisigDAO__factory } from "@repo/contracts";
import { ethers } from "ethers";
import { ThumbsDown, ThumbsUp, Clock, UserCheck, Loader2 } from "lucide-react";
import IconRejected from "@/assets/icons/IconRejected";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAccount, useReadContract } from "wagmi";
import { useContractWrite } from "@/hooks/useContracts";
import path from "@/constants/path";
import ModalStep, { MODAL_STEP } from "@/components/ModalStep/ModalStep";
import useWatchEventDAO from "@/hooks/useWatchEventDAO";

const ProposalDetail = () => {
  const { idDao, idProposal } = useParams<{
    idDao: `0x${string}`;
    idProposal: `0x${string}`;
  }>();
  const { address } = useAccount();

  const { data, isError, isLoading, refetch } = useReadContract({
    address: idDao as `0x${string}`,
    abi: MultisigDAO__factory.abi,
    functionName: "getProposalDetails",
    args: [BigInt(idProposal as `0x${string}`)],
    query: {
      enabled: !!idDao && !!idProposal,
    },
    account: address as `0x${string}`,
  });

  const {
    data: isOwner,
    isError: isOwnerError,
    isLoading: isOwnerLoading,
  } = useReadContract({
    address: idDao as `0x${string}`,
    abi: MultisigDAO__factory.abi,
    functionName: "s_isOwner",
    args: [address as `0x${string}`],
    query: {
      enabled: !!idDao && !!idProposal && !!address,
    },
  });

  const [isGetMetaData, setIsGetMetaData] = useState<boolean>(false);
  const [isGetMetaDataError, setIsGetMetaDataError] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<{ description: string } | null>(
    null
  );

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

  console.log("data", data);
  console.log("isOwner", isOwner);
  console.log("metaData", metaData);

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

  const totalVotes = data ? Number(data[1]) + Number(data[4]) : 0;
  const approvalPercentage =
    totalVotes > 0 && data ? (Number(data[1]) / totalVotes) * 100 : 0;

  const getStatusColor = (status: ProposalStatus): string => {
    switch (status) {
      case ProposalStatus.Passed:
        return "bg-amber-500";
      case ProposalStatus.Rejected:
        return "bg-red-500";
      case ProposalStatus.OnVoting:
        return "";
      case ProposalStatus.Executed:
        return "bg-[#24bfaded]";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.Passed:
        return <UserCheck className="w-5 h-5" />;
      case ProposalStatus.Executed:
        return <IconPassed />;
      case ProposalStatus.Rejected:
        return <IconRejected />;
      case ProposalStatus.OnVoting:
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  useWatchEventDAO({
    id: idDao as `0x${string}`,
    isOwner: !!isOwner,
    refetchStatusProposal: refetch,
  });

  useEffect(() => {
    const handleGetAllMetaData = async () => {
      setIsGetMetaData(true);
      try {
        const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
          ["string"],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any)[0]?.metadataURI as string
        );
        const res = await pinata.gateways.public
          .get(decodedData[0])
          .then((res) => {
            return res.data;
          });
        setMetaData(res);
        setIsGetMetaData(false);
      } catch (error) {
        console.log("getMetaData", error);
        setIsGetMetaData(false);
        setIsGetMetaDataError(true);
      }
    };

    if (data && data.length > 0) {
      handleGetAllMetaData();
    }
  }, [data]);

  useEffect(() => {
    if (isError || isOwnerError || isGetMetaDataError) {
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
      });
    }
  }, [isError, isOwnerError, isGetMetaDataError]);

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto bg-gray-900/90 border border-gray-700/50 shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Proposal
              </CardTitle>
              {/* <CardDescription className="text-gray-400">
                Created {mockProposal.createdAt?.toLocaleDateString()}
              </CardDescription> */}
              <CardDescription className="text-gray-400 text-[18px]">
                {metaData?.description || "No description provided"}
              </CardDescription>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 text-white rounded-full ${getStatusColor(data ? data[3] : 0)}`}
            >
              {getStatusIcon(data ? data[3] : 0)}
              {data && data[3] === ProposalStatus.OnVoting && (
                <p className="text-sm font-semibold">On Voting</p>
              )}
              {data && data[3] === ProposalStatus.Passed && (
                <p className="text-sm font-semibold">Passed</p>
              )}
              {data && data[3] === ProposalStatus.Executed && (
                <p className="text-sm font-semibold">Executed</p>
              )}
              {data && data[3] === ProposalStatus.Rejected && (
                <p className="text-sm font-semibold">Rejected</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4 bg-gray-800/50 rounded-xl p-6">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Approval Rate</span>
              <span className="font-semibold">
                {approvalPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${approvalPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 text-blue-400">
                <ThumbsUp className="w-5 h-5" />
                <div>
                  <div className="font-semibold">{data ? data[1] : ""}</div>
                  <div className="text-xs opacity-80">Approvals</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 text-red-400">
                <ThumbsDown className="w-5 h-5" />
                <div>
                  <div className="font-semibold">{data ? data[4] : ""}</div>
                  <div className="text-xs opacity-80">Rejections</div>
                </div>
              </div>
            </div>
          </div>

          {data && data[3] === ProposalStatus.OnVoting && isConnected && (
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleApprove}
                disabled={data[2] || !isConnected || methodName !== ""}
                className={`w-full max-w-[200px] h-11 ${
                  data[2]
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                } transition-all duration-300`}
              >
                <ThumbsUp className="w-4 h-4" />
                {data[2] ? "Approved" : "Approve"}
                {isWriteSuccess &&
                  !data[2] &&
                  methodName === "Approve proposal" && (
                    <Loader2 className="animate-spin text-yellow-400 w-5 h-5 ml-1" />
                  )}
              </Button>
              <Button
                onClick={handleReject}
                disabled={data[5] || !isConnected || methodName !== ""}
                className={`w-full max-w-[200px] h-11 ${
                  data[5]
                    ? "bg-red-500/20 text-red-300"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                } transition-all duration-300`}
              >
                <ThumbsDown className="w-4 h-4" />
                {data[5] ? "Rejected" : "Reject"}
                {isWriteSuccess &&
                  !data[5] &&
                  methodName === "Reject proposal" && (
                    <Loader2 className="animate-spin text-yellow-400 w-5 h-5 ml-1" />
                  )}
              </Button>
            </div>
          )}

          {data && data[3] === ProposalStatus.Passed && isConnected && (
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleExecute}
                disabled={!isConnected || methodName === "Execute proposal"}
                className="w-full max-w-[200px] h-11 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all duration-300"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Execute Proposal
                {isWriteSuccess && methodName === "Execute proposal" && (
                  <Loader2 className="animate-spin text-yellow-400 w-5 h-5 ml-1" />
                )}
              </Button>
            </div>
          )}
          {data && data[3] === ProposalStatus.Rejected && (
            <div>
              <p className="text-red-500 text-center font-semibold">
                This proposal has been rejected.
              </p>
            </div>
          )}
          {data && data[3] === ProposalStatus.Executed && (
            <div>
              <p className="text-green-500 text-center font-semibold">
                This proposal has been executed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Loading isLoading={isLoading || isOwnerLoading || isGetMetaData} />
      <ModalStep
        open={stepModal !== MODAL_STEP.READY}
        setOpen={setStepModal}
        contentStep={errorWrite}
        statusStep={stepModal}
      />
    </>
  );
};

export default ProposalDetail;
