import { ColumnTableHolder, HolderInterface } from "@/components/ColumnTableHolder/ColumnTableHolder";
import { DataTableTransfers } from "@/components/DataTableTransfers/DataTableTransfers";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import { getTokenHolders } from "@/schema/transactionSchema";
import { useQuery } from "@apollo/client";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const Holder = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(0);
  const { data, loading, error } = useQuery<{tokenHolders: HolderInterface[]}>(getTokenHolders, {
    variables: {
      where: {
        tokenAddress: {
          eq: id?.toLocaleLowerCase(),
        },
      },
      orderBy: {
        balance: {
          direction: "desc",
          priority: 0,
        },
      },
      offset: currentPage,
      limit: 10,
    },
  });

  const totalPages = useMemo(
    () => Math.ceil((data?.tokenHolders?.length || 0) / 10),
    [data?.tokenHolders?.length]
  );

  console.log(data);

  useEffect(() => {
    if (error) {
      console.log("Error fetching transactions:", { error });
      toast.error("Something went wrong");
    }
  }, [error]);

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E4E7EC]">
        <div className="text-sm text-[#212529]">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-[#f8f9fa] px-3 py-1.5 rounded-lg">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Top holders</span>
            </div>
          </div>
          <div className="text-xs mt-2 text-gray-500">
            Showing top holders by balance
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
      <DataTableTransfers columns={ColumnTableHolder} data={data?.tokenHolders || []} />
      <Loading isLoading={loading} />
    </div>
  );
};

export default Holder;
