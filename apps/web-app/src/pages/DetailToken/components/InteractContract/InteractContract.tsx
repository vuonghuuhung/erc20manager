import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReadContract from "./ReadContract/ReadContract";
import WriteContract from "./WriteContract/WriteContract";
import { TokenDetails } from "@/hooks/useTokenDetails";

const InteractContract = ({ tokenDetails }: { tokenDetails: TokenDetails }) => {
  return (
    <div>
      <Tabs defaultValue="Code" className="bg-transparent">
        <TabsList className="gap-2 mb-1 bg-transparent">
          <TabsTrigger value="Code">Code</TabsTrigger>
          <TabsTrigger value="readContract">Read Contract</TabsTrigger>
          <TabsTrigger value="writeContract">Write Contract</TabsTrigger>
        </TabsList>
        <TabsContent value="Code">Code</TabsContent>
        <TabsContent value="readContract">
          <ReadContract
            name={tokenDetails?.name}
            decimals={tokenDetails?.decimals}
            symbol={tokenDetails?.symbol}
            totalSupply={tokenDetails?.totalSupply}
            address={tokenDetails?.address}
          />
        </TabsContent>
        <TabsContent value="writeContract">
          <WriteContract decimals={tokenDetails?.decimals} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractContract;
