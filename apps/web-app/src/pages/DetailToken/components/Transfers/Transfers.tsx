import {
  columnsTransfers,
  Transfer,
} from "@/components/ColumnTableTransfers/ColumnTableTransfers";
import { DataTableTransfers } from "@/components/DataTableTransfers/DataTableTransfers";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GetAllTransactions } from "@/schema/transactionSchema";
import Loading from "@/components/Loading/Loading";
import { toast } from "sonner";

const Transfers = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useQuery<{ transactions: Transfer[] }>(
    GetAllTransactions,
    {
      variables: {
        where: {
          erc20Address: {
            eq: id?.toLocaleLowerCase(),
          },
        },
        offset: currentPage,
        limit: 10,
      },
    }
  );
  console.log(data);

  const totalPages = useMemo(
    () => Math.ceil((data?.transactions?.length || 0) / 10),
    [data?.transactions?.length]
  );

  useEffect(() => {
    if (error) {
      console.log("Error fetching transactions:", { error });
      toast.error("Something went wrong");
    }
  }, [error]);

  return (
    <div>
      <div className="overflow-hidden">
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#E4E7EC] ">
          <div className="text-sm text-[#212529]">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-[#f8f9fa] px-3 py-1.5 rounded-lg">
                <ArrowDownWideNarrow className="w-4 h-4 text-gray-600" />
                <span className="font-medium">
                  {data?.transactions?.length || 0} transactions
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#E4E7EC] hover:bg-[#f8f9fa] disabled:bg-[#f8f9fa] py-1 px-2 h-auto"
                  disabled={currentPage === 0}
                  onClick={() => {
                    if (currentPage > 0) {
                      setCurrentPage((prev) => prev - 1);
                    }
                  }}
                >
                  <ChevronLeft />
                </Button>
                <div className="text-[12px] py-1 px-2 bg-[#f8f9fa] text-[#6c757d] rounded-lg border border-[#E4E7EC]">
                  Page {currentPage + 1} of {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#E4E7EC] hover:bg-[#f8f9fa] disabled:bg-[#f8f9fa] py-1 px-2 h-auto"
                  disabled={currentPage + 1 === totalPages}
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage((prev) => prev + 1);
                    }
                  }}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DataTableTransfers
          columns={columnsTransfers(id || "")}
          data={data?.transactions || []}
        />
      </div>
      <Loading isLoading={loading} />
    </div>
  );
};

export default Transfers;
