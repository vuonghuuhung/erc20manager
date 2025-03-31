import BoxContent from "@/components/BoxContent";
import DAOItemCard from "@/components/DAOItemCard/DAOItemCard";
import path from "@/constants/path";
import { CirclePlus, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import imageDao from "@/assets/images/DAOIcon.png";
import { useReadContract } from "wagmi";
import { contractAddress } from "@/config/config";
import { ERC20Factory__factory } from "@repo/contracts";
import Loading from "@/components/Loading/Loading";
import { useEffect } from "react";
import { toast } from "sonner";
import useContractDetail from "@/hooks/useContractDetail";
import Nodata from "@/components/Nodata";

const mock = [
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
  {
    image: imageDao,
    name: "Cosmos Hub",
    description: "Native chain governance for Cosmos Hub.",
    totalSupply: "$113.33K est. USD value",
    totalProposal: 50,
    address: 123,
  },
];

const DAODashboard = () => {
  const {
    data: listDaoAddress,
    isLoading: isLoadingGetListDaoAddress,
    isError: isErrorListDaoAddress,
  } = useReadContract({
    address: contractAddress.ERC20FactoryAddress,
    abi: ERC20Factory__factory.abi,
    functionName: "getListOfDAO",
    args: [],
  });

  const {
    data: listDaoInfo,
    isLoading,
    isError: isErrorTokenDetail,
  } = useContractDetail(listDaoAddress as `0x${string}`[]);
  console.log("data contract", listDaoInfo);

  useEffect(() => {
    if (isErrorListDaoAddress || isErrorTokenDetail) {
      toast("Something went wrong");
    }
  }, [isErrorListDaoAddress, isErrorTokenDetail]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="text-[24px] flex items-center font-semibold">
          <ClipboardList className="mr-2" />
          List DAO
        </div>
        <div>
          <div className="flex items-center justify-center">
            <div className="relative group">
              <Link
                to={path.DAOCreate}
                className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10 block px-4 py-2 rounded-xl bg-gray-950">
                  <div className="relative z-10 flex items-center md:space-x-2">
                    <span className="hidden md:block transition-all duration-500 group-hover:translate-x-1">
                      Create DAO
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
      <BoxContent extendClassName="py-4">
        {listDaoInfo && listDaoInfo.length === 0 && <Nodata />}
        {listDaoInfo && listDaoInfo.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
            {listDaoInfo.map((item, index) => (
              <Link
                to={`/dao/detail/${item.addressDao}`}
                key={index}
                className="col-span-1"
              >
                <DAOItemCard totalProposal={item.listProposal?.length} />
              </Link>
            ))}
          </div>
        )}
      </BoxContent>
      <Loading isLoading={isLoading || isLoadingGetListDaoAddress} />
    </div>
  );
};

export default DAODashboard;
