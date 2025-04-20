import AvatarDAO from "@/components/AvatarDAO/AvatarDAO";
import BoxContent from "@/components/BoxContent";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProposalItem from "../components/ProposalItem/ProposalItem";
import Nodata from "@/components/Nodata";
import { Link, useParams } from "react-router-dom";
import useDAODetail from "@/hooks/useDAODetail";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading/Loading";
import useGetMetaData from "@/hooks/useGetMetaData";
import { toast } from "sonner";
import useGetStatusProposal, {
  MetaDataProposalType,
} from "@/hooks/useGetStatusProposal";
import useWatchEventDAO from "@/hooks/useWatchEventDAO";

const DAODetail = () => {
  const { id } = useParams<{ id: `0x${string}` }>();
  const [listProposal, setListProposal] = useState<MetaDataProposalType[]>([]);

  const {
    data: infoToken,
    isLoading: isLoadingInfo,
    isErrorContractAddress,
    refetch: refetchInfoToken,
  } = useDAODetail([id] as `0x${string}`[]);
  console.log("infoToken", infoToken);
  
  const {
    data: metaDataDao,
    isError: isErrorMetaDataDao,
    isLoading: isLoadingMetaDataDao,
  } = useGetMetaData([id] as `0x${string}`[]);

  const {
    data: statusProposal,
    isError: isErrorStatusProposal,
    isLoading: isLoadingStatusProposal,
    refetch: refetchStatusProposal,
  } = useGetStatusProposal(
    id as `0x${string}`,
    infoToken[0]?.listProposal || []
  );


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredProposals = statusProposal.filter(
      (proposal) =>
        proposal?.description?.toLowerCase().includes(value) ||
        proposal?.index?.toString() === value
    );
    setListProposal(filteredProposals);
  };

  useEffect(() => {
    if (statusProposal) {
      setListProposal(statusProposal);
    }
  }, [statusProposal]);

  useEffect(() => {
    if (isErrorContractAddress || isErrorMetaDataDao || isErrorStatusProposal) {
      toast("Something went wrong");
    }
  }, [isErrorContractAddress, isErrorMetaDataDao, isErrorStatusProposal]);

  useWatchEventDAO({
    id: id as `0x${string}`,
    refetchStatusProposal: refetchStatusProposal,
    refetchProposalCreated: refetchInfoToken,
  })

  return (
    <BoxContent extendClassName="py-6 bg-[#0C0D0E]">
      {/* DAO Header */}
      <div className="flex items-start gap-6 mb-12 p-6 bg-[#121314] rounded-xl">
        <div className="w-[120px] h-[120px] rounded-xl overflow-hidden">
          <AvatarDAO src={metaDataDao[0]?.image} />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-3">
            {metaDataDao[0]?.name}
          </h1>
          <p className="text-[15px] leading-relaxed text-[#9CA3AF]">
            {metaDataDao[0]?.description}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between min-h-[4rem] border-b border-t border-[#1F2023] px-4">
        <div className="text-[#f3f6f8f2] text-lg font-medium">
          Create a proposal
        </div>
        <Link
          to={`/dao/proposal/create/${id}`}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/30 hover:shadow-blue-800/40 transition-all duration-200 text-[14px] text-white font-semibold flex items-center gap-2.5 px-6 py-3 rounded-lg border border-blue-500/30"
        >
          <Plus className="w-5 h-5 animate-pulse" />
          <span>New proposal</span>
        </Link>
      </div>

      {/* Proposal Section */}
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-xl text-[#f3f6f8f2]">Proposals</h2>

          {/* Search Bar */}
          <div className="relative w-[320px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-[#6B7280]" />
            </div>
            <Input
              className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-[#121314] border-[#1F2023] rounded-lg text-white placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#1E40AF] transition-all"
              placeholder="Search proposals..."
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="text-white space-y-4">
          {!listProposal || listProposal.length === 0 ? (
            <Nodata
              title="No Proposals Yet"
              description="Create your first proposal to start making decisions together"
            />
          ) : (
            listProposal.map((item, index) => (
              <ProposalItem
                key={index}
                idProposal={index}
                status={item.status}
                description={item.description}
                isOwner={item.isOwner}
                isApproved={item.isApproved}
                isRejected={item.isRejected}
              />
            ))
          )}
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
