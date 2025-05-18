import { ColumnDef } from "@tanstack/react-table";
import CopyComponent from "../CopyComponent/CopyComponent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

// const formatAddress = (address: string) => {
//   if (!address) return "";
//   return `${address.slice(0, 10)}...${address.slice(-8)}`;
// };

// const formatTxHash = (address: string) => {
//   if (!address) return "";
//   return `${address.slice(0, 10)}...`;
// };

export type Holder = {
  rank: number;
  address: string;
  quantity: string;
  percentage: string;
  value: string;
};

export const ColumnTableHolder: ColumnDef<Holder>[] = [
  {
    accessorKey: "rank",
    header: () => <div className="">Rank</div>,
    cell: ({ row }) => <div>{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "chainName",
    header: "Address",
    cell: ({ row }) => {
      console.log("row", row);

      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <span className="flex items-center text-[#0784c3] hover:text-blue-600 truncate">
                {row.getValue("chainName")}
                <CopyComponent
                  tokenAddress={row.original.address}
                  className="ml-2"
                />
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-[#0E1C2B] text-white border-none"
            >
              <TooltipArrow width={11} height={5} fill="#0E1C2B" />
              <div className="text-center text-[12px]">
                {row.getValue("chainName")}
              </div>
              <div className="flex items-center space-x-2 mt-1 text-[12px]">
                {row.original.address}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ row }) => {
      return <div className="min-w-[112px]">{row.getValue("percentage")}</div>;
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("value") as string;
      return <div>{value}</div>;
    },
  },
];
