import {
  columnsTransfers,
  Transfer,
} from "@/components/ColumnTableTransfers/ColumnTableTransfers";
import { DataTableTransfers } from "@/components/DataTableTransfers/DataTableTransfers";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Transfers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { id } = useParams<{ id: string }>();

  const data: Transfer[] = [
    {
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      age: new Date(Date.now() - 2 * 60 * 1000),
      method: "Transfer",
      block: 12345678,
      from: "0xabcdef1234567890abcdef1234567890abcdef12",
      to: "0x9876543210fedcba9876543210fedcba98765432",
      amount: "1000000",
    },
    {
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      age: new Date(Date.now() - 2 * 60 * 1000),
      method: "Transfer",
      block: 12345678,
      from: "0xabcdef1234567890abcdef1234567890abcdef12",
      to: "0x9876543210fedcba9876543210fedcba98765432",
      amount: "1000000",
    },
    {
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      age: new Date(Date.now() - 2 * 60 * 1000),
      method: "Transfer",
      block: 12345678,
      from: "0xabcdef1234567890abcdef1234567890abcdef12",
      to: "0x9876543210fedcba9876543210fedcba98765432",
      amount: "1000000",
    },
  ];

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div>
      <div className="rounded-xl overflow-hidden">
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#E4E7EC] ">
          <div className="text-sm text-[#212529]">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-[#f8f9fa] px-3 py-1.5 rounded-lg">
                <ArrowDownWideNarrow className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{data.length} transactions</span>
              </div>
            </div>
            <div className="text-xs mt-2">
              (Showing {startIndex + 1} to {Math.min(endIndex, data.length)}{" "}
              records)
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className="border-[#E4E7EC] hover:bg-[#f8f9fa] disabled:bg-[#f8f9fa] py-1 px-2 h-auto"
                >
                  <ChevronLeft />
                </Button>
                <div className="text-[12px] py-1 px-2 bg-[#f8f9fa] text-[#6c757d] rounded-lg border border-[#E4E7EC]">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="border-[#E4E7EC] hover:bg-[#f8f9fa] disabled:bg-[#f8f9fa] py-1 px-2 h-auto"
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DataTableTransfers
          columns={columnsTransfers(id || "")}
          data={currentData}
        />
      </div>
    </div>
  );
};

export default Transfers;
