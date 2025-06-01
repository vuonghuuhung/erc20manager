import IconPassed from "@/assets/icons/IconPassed";
import IconRejected from "@/assets/icons/IconRejected";
import Loading from "@/components/Loading/Loading";
import { cn } from "@/lib/utils";
import { GetTransactionByHash } from "@/schema/transactionSchema";
import { useQuery } from "@apollo/client";
import { CircleHelp, Hourglass } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { formatUnits } from "ethers";

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  isHash?: boolean;
  isAddress?: boolean;
}

export type TransactionDetail = {
  hash: string;
  method: string;
  block: number;
  timestamp: Date;
  from: string;
  to: string;
  amount: string;
  gas: string;
  gasPrice: string;
  status: string;
  txnFee: string;
  input: string;
};

const InfoRow = ({ label, value, isHash, isAddress }: InfoRowProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex items-center gap-2 text-gray-500 lg:min-w-[300px]">
        <CircleHelp className="w-4 h-4" />
        <span className="text-gray-500 min-w-32">{label}:</span>
      </div>
      <div
        className={cn(
          "font-medium break-all",
          (isHash || isAddress) && "font-mono text-blue-600"
        )}
      >
        {value}
      </div>
    </div>
  );
};

const TxOverview = () => {
  const { txHash } = useParams<{ id: string; txHash: string }>();

  const { data, loading, error } = useQuery<{
    transactions: TransactionDetail[];
  }>(GetTransactionByHash, {
    variables: {
      where: {
        hash: {
          eq: txHash,
        },
      },
    },
  });

  console.log("Transaction data:", data);

  useEffect(() => {
    if (error) {
      console.log("Error fetching transactions:", { error });
      toast.error("Something went wrong");
    }
  }, [error]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Success":
        return "bg-[#24bfaded]";
      case "failed":
        return "bg-red-500";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <IconPassed />;
      case "failed":
        return <IconRejected />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-headerMain">
      <h1 className="text-2xl font-bold mb-6">
        {data?.transactions[0]?.method}
      </h1>

      <div className="space-y-6">
        <div className="space-y-4">
          <InfoRow
            label="Transaction Hash"
            value={data?.transactions[0]?.hash}
            isHash
          />
          <InfoRow
            label="Status"
            value={
              <div
                className={`flex items-center gap-2 px-3 py-1.5 text-white rounded-full ${getStatusColor(data && data?.transactions ? data.transactions[0].status : "")}`}
              >
                {getStatusIcon(
                  data && data?.transactions ? data.transactions[0].status : ""
                )}
                <p className="text-sm font-semibold">
                  {data?.transactions[0].status || 0}
                </p>
              </div>
            }
          />
          <InfoRow
            label="Block"
            value={
              <div className="flex items-center gap-2">
                <Hourglass className="w-4 h-4" />
                <span className=" text-blue-600">
                  {data?.transactions[0]?.block}
                </span>
              </div>
            }
          />
          <InfoRow
            label="Timestamp"
            value={formatDistanceToNow(
              data?.transactions[0]?.timestamp || new Date(),
              { addSuffix: true }
            )}
          />
        </div>

        {/* Token Transfer Details */}
        <div className="pt-6 border-t">
          <div className="space-y-4">
            <InfoRow
              label="From"
              value={data?.transactions[0]?.from}
              isAddress
            />
            <InfoRow label="To" value={data?.transactions[0]?.to} isAddress />
            <InfoRow
              label="Value"
              value={`${data?.transactions[0]?.amount} ETH`}
            />
          </div>
        </div>

        {/* Transaction Fee */}
        <div className="pt-6 border-t">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
              <div className="flex items-center gap-2 text-gray-500 lg:min-w-[300px]">
                <CircleHelp className="w-4 h-4" />
                <span className="text-gray-500 min-w-32">{"Input"}:</span>
              </div>
              <div className={cn("font-medium break-all flex-1")}>
                <textarea
                  className="w-full p-2 border rounded-md bg-gray-50 text-sm "
                  rows={3}
                  value={data?.transactions[0]?.input || "N/A"}
                ></textarea>
              </div>
            </div>
            <InfoRow
              label="Gas"
              value={`${data?.transactions[0]?.gas} Gwei ${formatUnits(data?.transactions[0]?.gas ? data.transactions[0].gas : 0, "ether")} ETH`}
            />
            <InfoRow
              label="Gas Price"
              value={`${data?.transactions[0]?.gasPrice} Gwei ${formatUnits(data?.transactions[0]?.gasPrice ? data.transactions[0].gasPrice : 0, "ether")} ETH`}
            />
            <InfoRow
              label="Transaction Fee"
              value={`${data?.transactions[0]?.txnFee} Gwei ${formatUnits(data?.transactions[0]?.txnFee ? data.transactions[0].txnFee : 0, "ether")} ETH`}
            />
          </div>
        </div>
      </div>
      <Loading isLoading={loading} />
    </div>
  );
};

export default TxOverview;
