import BoxContent from "@/components/BoxContent";
import DAOItemCard from "@/components/DAOItemCard/DAOItemCard";
import path from "@/constants/path";
import { CirclePlus, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useReadContract } from "wagmi";
import { contractAddress } from "@/config/config";
import { DAOFactory__factory } from "@repo/contracts";
import Loading from "@/components/Loading/Loading";
import { useEffect } from "react";
import { toast } from "sonner";
import useDAODetail from "@/hooks/useDAODetail";
import Nodata from "@/components/Nodata";
import useGetMetaData from "@/hooks/useGetMetaData";

const DAODashboard = () => {
  const {
    data: listDaoAddress,
    isLoading: isLoadingGetListDaoAddress,
    isError: isErrorListDaoAddress,
  } = useReadContract({
    address: contractAddress.DAOFactoryAddress,
    abi: DAOFactory__factory.abi,
    functionName: "getListOfDAO",
    args: [],
  });

  const {
    data: listDaoInfo,
    isLoading,
    isError: isErrorTokenDetail,
  } = useDAODetail(listDaoAddress as `0x${string}`[]);

  const {
    data: metaDataDao,
    isError: isErrorMetaDataDao,
    isLoading: isLoadingMetaDataDao,
  } = useGetMetaData(listDaoAddress as `0x${string}`[]);

  useEffect(() => {
    if (isErrorListDaoAddress || isErrorTokenDetail || isErrorMetaDataDao) {
      toast("Something went wrong");
    }
  }, [isErrorListDaoAddress, isErrorTokenDetail, isErrorMetaDataDao]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700/50 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <ClipboardList className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Decentralized Autonomous Organizations
            </h1>
          </div>

          <Link
            to={path.DAOCreate}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 transition-all hover:scale-105"
          >
            <span className="relative flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-opacity-90">
              <span>Create DAO</span>
              <CirclePlus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </span>
          </Link>
        </div>
      </div>

      <BoxContent extendClassName="p-6 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50">
        {listDaoInfo && listDaoInfo.length === 0 && (
          <Nodata
            title="No DAOs Found"
            description="Create your first DAO to get started with decentralized governance"
          />
        )}
        {listDaoInfo && listDaoInfo.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            {listDaoInfo.map((item, index) => (
              <Link
                to={`/dao/detail/${item.addressDao}`}
                key={index}
                className="col-span-1"
              >
                <DAOItemCard
                  avatarDao={metaDataDao[index]?.image}
                  nameDao={metaDataDao[index]?.name}
                  description={metaDataDao[index]?.description}
                  totalSupply={item?.totalSupply}
                  symbol={item?.symbol}
                  totalProposal={item?.listProposal?.length || 0}
                />
              </Link>
            ))}
          </div>
        )}
      </BoxContent>
      <Loading
        isLoading={
          isLoading || isLoadingGetListDaoAddress || isLoadingMetaDataDao
        }
      />
    </div>
  );
};

export default DAODashboard;
