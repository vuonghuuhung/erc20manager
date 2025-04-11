import AvatarDAO from "@/components/AvatarDAO/AvatarDAO";
import BoxContent from "@/components/BoxContent";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProposalItem from "../components/ProposalItem/ProposalItem";
import Nodata from "@/components/Nodata";
import { Link, useParams } from "react-router-dom";
import useDAODetail from "@/hooks/useDAODetail";
import { useEffect } from "react";
import Loading from "@/components/Loading/Loading";
import useGetMetaData from "@/hooks/useGetMetaData";
import { toast } from "sonner";
import useGetStatusProposal from "@/hooks/useGetStatusProposal";
const DAODetail = () => {
  const { id } = useParams<{ id: `0x${string}` }>();
  const {
    data: infoToken,
    isLoading: isLoadingInfo,
    isErrorContractAddress,
  } = useDAODetail([id] as `0x${string}`[]);

  const {
    data: metaDataDao,
    isError: isErrorMetaDataDao,
    isLoading: isLoadingMetaDataDao,
  } = useGetMetaData([id] as `0x${string}`[]);

  const {
    data: statusProposal,
    isError: isErrorStatusProposal,
    isLoading: isLoadingStatusProposal,
    refetch,
  } = useGetStatusProposal(id, infoToken[0]?.listProposal || []);

  console.log("statusProposal", statusProposal);

  // const { data } = useReadContract({
  //   address: id,
  //   abi: MultisigDAO__factory.abi,
  //   functionName: "s_isRejected",
  //   query: {
  //     enabled: address !== undefined,
  //   },
  //   args: [0n, address as `0x${string}`],
  // });

  // console.log("data proposal approve", data);

  useEffect(() => {
    if (isErrorContractAddress || isErrorMetaDataDao || isErrorStatusProposal) {
      toast("Something went wrong");
    }
  }, [isErrorContractAddress, isErrorMetaDataDao, isErrorStatusProposal]);

  return (
    <BoxContent extendClassName="py-4 bg-[#151617]">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-[108px] h-[108px]">
          <AvatarDAO src={metaDataDao[0]?.image} />
        </div>
        <div>
          <div className="text-4xl font-bold text-white">
            {metaDataDao[0]?.name}
          </div>
          <div className="text-[14px] text-[#D1D5DB] mt-1">
            {metaDataDao[0]?.description}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between min-h-[3.5rem] border-b border-t border-[#2D2E30]">
        <div className="text-[#f3f6f8f2]">Create a proposal</div>
        <Link
          to={`/dao/proposal/create/${id}`}
          className="bg-[#fffffff2] text-[12px] text-[#151617] font-semibold flex items-center gap-2 px-4 py-2 rounded-lg"
        >
          <Plus />
          <span>New proposal</span>
        </Link>
      </div>
      <div className="py-6">
        <div className="font-semibold text-[#f3f6f8f2] mb-4">Proposals</div>
        <div className="flex group flex-row items-center text-[#f3f6f880] gap-1 rounded-md ring-1 ring-[#f3f6f81a] transition focus-within:ring-2 focus-within:ring-border-interactive-focus p-2 mb-8">
          <div>
            <Search className="w-4 h-4 text-current group-focus-within:text-white transition duration-300" />
          </div>
          <div className="flex-1">
            <Input
              className="text-[8px] py-0 h-auto border-none grow bg-transparent leading-4 text-text-tertiary transition placeholder:text-text-tertiary focus:text-text-body focus:outline-none"
              placeholder="Search proposals..."
            />
          </div>
        </div>
        <div className="text-white">
          {!statusProposal || (statusProposal.length === 0 && <Nodata />)}
          {statusProposal &&
            statusProposal.length > 0 &&
            statusProposal.map((item, index) => (
              <ProposalItem
                key={index}
                refetch={refetch}
                idProposal={index}
                status={item.status}
                description={item.description}
                isOwner={item.isOwner}
                isApproved={item.isApproved}
                isRejected={item.isRejected}
              />
            ))}
        </div>
      </div>
      <Loading
        isLoading={
          isLoadingInfo || isLoadingMetaDataDao || isLoadingStatusProposal
        }
      />
    </BoxContent>
  );
};

export default DAODetail;
