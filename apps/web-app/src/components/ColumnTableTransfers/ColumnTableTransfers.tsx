import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { MoveRight } from "lucide-react";
import CopyComponent from "../CopyComponent/CopyComponent";
import { Link } from "react-router-dom";

const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
};

const formatTxHash = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 10)}...`;
};

export type Transfer = {
  txHash: string;
  method: string;
  block: number;
  age: Date;
  from: string;
  to: string;
  amount: string;
};

export const columnsTransfers = (tokenId: string): ColumnDef<Transfer>[] => [
  {
    accessorKey: "txHash",
    header: () => <div className="">Transaction Hash</div>,
    cell: ({ row }) => {
      return (
        <Link
          to={`/token/detail/${tokenId}/tx/${row.getValue("txHash")}`}
          className="font-medium max-w-[195px] flex items-center text-[#0784c3] hover:text-blue-600 truncate"
        >
          {formatTxHash(row.getValue("txHash"))}
          <CopyComponent
            tokenAddress={row.getValue("txHash")}
            className="ml-3"
          />
        </Link>
      );
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      return (
        <span
          className=" border border-opacity-10 text-black font-normal truncate py-2 px-4 rounded-xl"
          data-bs-toggle="tooltip"
          data-bs-boundary="viewport"
          data-bs-html="true"
          data-title="Transfer"
        >
          {row.getValue("method")}
        </span>
      );
    },
  },
  {
    accessorKey: "block",
    header: "Block",
    cell: ({ row }) => (
      <div className="font-medium text-[#0784c3] hover:text-blue-600">
        {row.getValue("block")}
      </div>
    ),
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => {
      const date = row.getValue("age") as Date;
      return (
        <div className="min-w-[112px]">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      );
    },
  },
  {
    accessorKey: "from",
    header: () => <div className=" w-[20%]">From</div>,
    cell: ({ row }) => (
      <div className="font-medium text-[#0784c3] hover:text-blue-600 truncate">
        {formatAddress(row.getValue("from"))}
        <CopyComponent tokenAddress={row.getValue("txHash")} className="ml-3" />
      </div>
    ),
  },
  {
    accessorKey: "to",
    header: () => <div className=" w-[20%]">To</div>,
    cell: ({ row }) => (
      <div className="font-medium flex items-center gap-3 text-[#0784c3] hover:text-blue-600 truncate">
        <span className="w-[24px] h-[24px] rounded-full border border-[#00a18640] bg-[#00a1861a] flex items-center justify-center">
          <MoveRight className="w-4 h-4 text-[#00a186]" />
        </span>
        <div>{formatAddress(row.getValue("to"))}</div>
        <CopyComponent tokenAddress={row.getValue("txHash")} />
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const value = row.getValue("amount") as string;
      return <div>{value}</div>;
    },
  },
];
