import { ColumnDef } from "@tanstack/react-table";
import CopyComponent from "../CopyComponent/CopyComponent";
import { handleConvertToToken } from "@/utils/convertNumber";

const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
};

// const formatTxHash = (address: string) => {
//   if (!address) return "";
//   return `${address.slice(0, 10)}...`;
// };

export type HolderInterface = {
  balance: string;
  holderAddress: string;
  token: {
    totalSupply: string;
    decimals?: number;
  };
};

export const ColumnTableHolder: ColumnDef<HolderInterface>[] = [
  {
    accessorKey: "rank",
    header: () => <div className="">Rank</div>,
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "holderAddress",
    header: "Address",
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-[#0784c3] hover:text-blue-600 truncate">
          {formatAddress(row.getValue("holderAddress"))}
          <CopyComponent
            tokenAddress={row.original.holderAddress}
            className="ml-2"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Quantity",
    cell: ({ row }) => {
      const balance = row.getValue("balance") as string;
      const formattedBalance = handleConvertToToken(
        balance,
        row.original.token?.decimals || 18
      );
      return <div>{formattedBalance}</div>;
    },
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ row }) => {
      const totalSupply = row.original.token.totalSupply || 1;
      const percentage =
        (Number(row.getValue("balance") || 0) / Number(totalSupply)) * 100;
      return <div className="min-w-[112px]">{percentage}%</div>;
    },
  },
];
