import { TokenDetails } from "@/hooks/useTokenDetails";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TokenDetails>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "decimals",
    header: "Decimals",
  },
  {
    accessorKey: "totalSupply",
    header: "TotalSupply",
    cell: ({ row }) => {
      return (
        <div className="flex items-center md:justify-center">
          <div>{row.original.totalSupply}</div>
          <div className="ml-2">{row.original.symbol}</div>
        </div>
      );
    },
  },
];
