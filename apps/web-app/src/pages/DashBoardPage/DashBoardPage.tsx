import Loading from "@/components/Loading/Loading";
import useTokenDetails from "@/hooks/useTokenDetails";
import { ERC20Factory__factory } from "@repo/contracts";
import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { toast } from "sonner";
import { DataTable } from "@/components/DataTable/DataTable";
import { columns } from "@/components/ColumnTable/ColumnTable";
import { ClipboardList, CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import path from "@/constants/path";
import { contractAddress } from "@/config/config";

const DashBoardPage = () => {
  const {
    data: listTokenAddress,
    isLoading: isLoadingGetListToken,
    isError: isErrorListToken,
  } = useReadContract({
    address: contractAddress.ERC20FactoryAddress,
    abi: ERC20Factory__factory.abi,
    functionName: "getListOfERC20Created",
    args: [],
  });

  const {
    data,
    isLoading,
    isError: isErrorTokenDetail,
  } = useTokenDetails(listTokenAddress as `0x${string}`[]);

  useEffect(() => {
    if (isErrorListToken || isErrorTokenDetail) {
      toast("Something went wrong");
    }
  }, [isErrorListToken, isErrorTokenDetail]);

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <ClipboardList className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Listed Tokens
              </h1>
            </div>

            <Link
              to={path.createToken}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 transition-all hover:scale-105"
            >
              <span className="relative flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-opacity-90">
                <span>Create Token</span>
                <CirclePlus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              </span>
            </Link>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-700/50">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
      <Loading isLoading={isLoading || isLoadingGetListToken} />
    </div>
  );
};

export default DashBoardPage;
