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
    <div>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div className="text-[24px] flex items-center font-semibold">
            <ClipboardList className="mr-2" />
            List Tokens
          </div>
          <div>
            <div className="flex items-center justify-center">
              <div className="relative group">
                <Link
                  to={path.createToken}
                  className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative z-10 block px-4 py-2 rounded-xl bg-gray-950">
                    <div className="relative z-10 flex items-center md:space-x-2">
                      <span className="hidden md:block transition-all duration-500 group-hover:translate-x-1">
                        Create Token
                      </span>
                      <span className="transition-all duration-500 md:group-hover:translate-x-1">
                        <CirclePlus />
                      </span>
                    </div>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
      <Loading isLoading={isLoading || isLoadingGetListToken} />
    </div>
  );
};

export default DashBoardPage;
