import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoxContent from "@/components/BoxContent";
import TxOverview from "./TxOverview/TxOverview";
import TxLogs from "./TxLogs/TxLogs";

const TxDetail = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <BoxContent extendClassName="p-6">
        <h1 className="text-[25px] text-[#223354] font-bold mb-6">
          Transaction Details
        </h1>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full border-t-[1px] pt-0 border-[#E4E7EC] bg-transparent rounded-none">
            <TabsTrigger
              value="overview"
              className="flex-1 !shadow-none data-[state=active]:text-[#223354] data-[state=active]:border-t-[#223354] data-[state=active]:border-t rounded-none text-[#6B7280]"
            >
              Overview
            </TabsTrigger>
            {/* <TabsTrigger
              value="logs"
              className="flex-1 !shadow-none data-[state=active]:text-[#223354] data-[state=active]:border-t-[#223354] data-[state=active]:border-t rounded-none text-[#6B7280]"
            >
              Logs
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview">
            <div className="p-4">
              <TxOverview />
            </div>
          </TabsContent>
          <TabsContent value="logs">
            <div className="p-4">
              <TxLogs />
            </div>
          </TabsContent>
        </Tabs>
      </BoxContent>
    </div>
  );
};

export default TxDetail;
