import BoxContent from "@/components/BoxContent";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DistributeProposal from "../components/DistributeProposal/DistributeProposal";
import BurnProposal from "../components/BurnProposal/BurnProposal";
import ApproveProposal from "../components/ApproveProposal/ApproveProposal";
import UpdateMetadataDAO from "../components/UpdateMetadataDAO/UpdateMetadataDAO";

const CreateProposal = () => {

  return (
    <div>
      <BoxContent extendClassName="p-4 pb-8 w-full">
        <h3 className="text-[25px] text-[#223354] font-bold mb-6">
          Create proposal
        </h3>
        <div className="max-w-[935px] mx-auto">
          <Tabs defaultValue="distribute" className="w-full">
            <TabsList className="w-full border-t-[1px] pt-0 border-[#E4E7EC] bg-transparent rounded-none">
              <TabsTrigger
                value="distribute"
                className="flex-1 !shadow-none data-[state=active]:border-t-black data-[state=active]:border-t rounded-none "
              >
                Distribute
              </TabsTrigger>
              <TabsTrigger
                value="burn"
                className="flex-1 !shadow-none data-[state=active]:border-t-black data-[state=active]:border-t rounded-none "
              >
                Burn
              </TabsTrigger>
              <TabsTrigger
                value="approve"
                className="flex-1 !shadow-none data-[state=active]:border-t-black data-[state=active]:border-t rounded-none "
              >
                Approve
              </TabsTrigger>
              <TabsTrigger
                value="updateMetadata"
                className="flex-1 !shadow-none data-[state=active]:border-t-black data-[state=active]:border-t rounded-none "
              >
                Metadata
              </TabsTrigger>
            </TabsList>
            <TabsContent value="distribute">
              <DistributeProposal />
            </TabsContent>
            <TabsContent value="burn">
              <BurnProposal />
            </TabsContent>
            <TabsContent value="approve">
              <ApproveProposal />
            </TabsContent>
            <TabsContent value="updateMetadata">
              <UpdateMetadataDAO />
            </TabsContent>
          </Tabs>
        </div>
      </BoxContent>
    </div>
  );
};

export default CreateProposal;
