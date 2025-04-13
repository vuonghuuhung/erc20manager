import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Nodata from "../Nodata";
import { TokenDetails } from "@/hooks/useTokenDetails";
import { useNavigate } from "react-router-dom";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-[8px] overflow-hidden shadow-tableShadow bg-white ">
      <Table className="flex flex-col">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className=" hover:!bg-[#ffffff80] !bg-[#ffffff80] cursor-default flex w-full items-center justify-between"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="py-4 text-[14px] md:text-center last:hidden md:last:block flex-1 px-2"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  const idVault = (row.original as TokenDetails).address;
                  navigate(`/token/detail/${idVault}`);
                }}
                data-state={row.getIsSelected() && "selected"}
                className="transition-all duration-250 hover:[#22335405] md:flex grid grid-cols-3 cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="md:text-center px-2 last:pt-0 md:last:py-4 col-span-1 md:flex-1 last:col-span-3 group text-left"
                  >
                    <div className="group-last:block md:group-last:hidden hidden mb-1 text-[14px] font-medium text-[#71717a]">
                      {cell.column.columnDef.header as React.ReactNode}
                    </div>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="flex w-full items-center justify-center">
              <TableCell colSpan={columns.length}>
                <Nodata
                  title="No Records Found"
                  description="There are no records to display in this table"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
