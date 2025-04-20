import { useWaitForTransactionReceipt } from "wagmi";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { transactionInfo } from "@/store/listTransactionState";
import { useLocation, matchPath, useMatch } from "react-router-dom";

const TxWaitStatusItem = ({
  hash,
  functionName,
  urlReCall,
}: transactionInfo) => {
  const isMatchUrlPage = useMatch(urlReCall || "")

  const queryClient = useQueryClient();
  const prevStatus = useRef<"pending" | "success" | "error" | null>(null);

  const { status, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (
      isSuccess &&
      functionName === "Create ERC20 Token" &&
      prevStatus.current === "pending" &&
      status === "success"
    ) {
      if (isMatchUrlPage) {
        queryClient.invalidateQueries({
          queryKey: ["getListOfERC20Created"],
        });
      }
      toast.success("Create ERC20 Token successfully", {
        position: "top-right",
        className: "text-green-400",
      });
    }

    if (
      isSuccess &&
      functionName === "Create DAO" &&
      prevStatus.current === "pending" &&
      status === "success"
    ) {
      if (isMatchUrlPage) {
        queryClient.invalidateQueries({
          queryKey: ["getListOfDAO"],
        });
      }
      toast.success("Create DAO successfully", {
        position: "top-right",
        className: "text-green-400",
      });
    }

    // if (
    //   isSuccess &&
    //   functionName === "Approve proposal" &&
    //   prevStatus.current === "pending" &&
    //   status === "success"
    // ) {
    //   if (isMatchUrlPage) {
    //     queryClient.invalidateQueries({
    //       queryKey: ["getStatusProposal"],
    //       exact: false,
    //     });
    //   }
    //   toast.success("Approve proposal successfully", {
    //     position: "top-right",
    //     className: "text-green-400",
    //   });
    // }

    // if (
    //   isSuccess &&
    //   functionName === "Reject proposal" &&
    //   prevStatus.current === "pending" &&
    //   status === "success"
    // ) {
    //   if (isMatchUrlPage) {
    //     queryClient.invalidateQueries({
    //       queryKey: ["getStatusProposal"],
    //       exact: false,
    //     });
    //   }
    //   toast.success("Reject proposal successfully", {
    //     position: "top-right",
    //     className: "text-green-400",
    //   });
    // }

    // if (
    //   isSuccess &&
    //   functionName === "Execute proposal" &&
    //   prevStatus.current === "pending" &&
    //   status === "success"
    // ) {
    //   if (isMatchUrlPage) {
    //     queryClient.invalidateQueries({
    //       queryKey: ["getStatusProposal"],
    //       exact: false,
    //     });
    //   }
    //   toast.success("Executing proposal successfully", {
    //     position: "top-right",
    //     className: "text-green-400",
    //   });
    // }

    // if (
    //   isSuccess &&
    //   functionName === "Approve Token" &&
    //   prevStatus.current === "pending" &&
    //   status === "success"
    // ) {
    //   if (isMatchUrlPage) {
    //     queryClient.invalidateQueries({
    //       queryKey: ["getDaoDetail"],
    //       exact: false,
    //     });
    //   }
    //   toast.success("Approve Token successfully", {
    //     position: "top-right",
    //     className: "text-green-400",
    //   });
    // }

    // if (
    //   isSuccess &&
    //   functionName === "Burn Token" &&
    //   prevStatus.current === "pending" &&
    //   status === "success"
    // ) {
    //   if (isMatchUrlPage) {
    //     queryClient.invalidateQueries({
    //       queryKey: ["getDaoDetail"],
    //       exact: false,
    //     });
    //   }
    //   toast.success("Burn Token successfully", {
    //     position: "top-right",
    //     className: "text-green-400",
    //   });
    // }

    // if (
    //   isSuccess &&
    //   functionName === "Distribute Token" &&
    //   prevStatus.current === "pending" &&
    //   status === "success"
    // ) {
    //   if (isMatchUrlPage) {
    //     queryClient.invalidateQueries({
    //       queryKey: ["getDaoDetail"],
    //       exact: false,
    //     });
    //   }
    //   toast.success("Distribute Token successfully", {
    //     position: "top-right",
    //     className: "text-green-400",
    //   });
    // }

    // if (
    //   isSuccess &&
    //   functionName === "Update Metadata DAO" &&
    //   prevStatus.current === "pending" &&
    //   status === "success"
    // ) {
    //   if (isMatchUrlPage) {
    //     queryClient.invalidateQueries({
    //       queryKey: ["getDaoDetail"],
    //       exact: false,
    //     });
    //   }
    //   toast.success("Update Metadata DAO successfully", {
    //     position: "top-right",
    //     className: "text-green-400",
    //   });
    // }

    prevStatus.current = status;
  }, [status, isSuccess, functionName, queryClient, isMatchUrlPage]);

  return (
    <div>
      <a
        href={`https://holesky.etherscan.io/tx/${hash}`}
        target="_blank"
        className="p-2 border rounded-md text-sm cursor-pointer block"
      >
        <div className="truncate">Hash: {hash}</div>
        <div className="mt-1">Action: {functionName}</div>
        <div className="flex items-center gap-2 mt-1">
          <div>Status:</div>
          {status === "pending" && (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-yellow-400 w-5 h-5" />
              <div>Transaction is pending...</div>
            </div>
          )}
          {status === "success" && (
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400 w-5 h-5" />
              <div>Transaction confirmed!</div>
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2">
              <XCircle className="text-red-400 w-5 h-5" />
              <div>Transaction failed.</div>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default TxWaitStatusItem;
