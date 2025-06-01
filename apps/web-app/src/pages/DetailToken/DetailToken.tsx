import { useParams } from "react-router-dom";
import { CoinsIcon } from "lucide-react";
import Loading from "@/components/Loading/Loading";
import BoxContent from "@/components/BoxContent";
import useTokenDetails from "@/hooks/useTokenDetails";
import OverviewToken from "./components/InfoToken/OverviewToken/OverviewToken";
import OtherInfoToken from "./components/InfoToken/OtherInfoToken/OtherInfoToken";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InteractContract from "./components/InteractContract/InteractContract";
import { useEffect } from "react";
import useTokenDetailStore from "@/store/tokenDetailState";
import Transfers from "./components/Transfers/Transfers";
import Holder from "./components/Holder/Holder";

const DetailToken = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: infoToken,
    isLoading: isLoadingInfo,
    isErrorContractAddress,
    error,
  } = useTokenDetails([id] as `0x${string}`[]);
  const { tokenDetail, setTokenDetail } = useTokenDetailStore();

  useEffect(() => {
    if (
      infoToken &&
      infoToken.length > 0 &&
      JSON.stringify(infoToken[0]) !== JSON.stringify(tokenDetail)
    ) {
      setTokenDetail(infoToken[0]);
    }
  }, [infoToken, setTokenDetail, tokenDetail, error]);

  return (
    <div>
      {!isErrorContractAddress ? (
        <div>
          <div className="flex items-center gap-4 pb-6 border-b border-b-[#dadbdd]/20">
            <div className="p-3 bg-[#1e1e1e] rounded-lg">
              <CoinsIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">
                {infoToken ? infoToken[0]?.name : ""}
              </h2>
              <span className="text-xl text-[#6c757d] font-medium">
                {infoToken ? `(${infoToken[0]?.symbol})` : ""}
              </span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
            <BoxContent extendClassName="col-span-2 lg:col-span-1 rounded-[6px] p-4">
              <OverviewToken totalSupply={infoToken[0]?.totalSupply} />
            </BoxContent>
            <BoxContent extendClassName="col-span-2 lg:col-span-1 rounded-[6px] p-4">
              <OtherInfoToken
                tokenAddress={id}
                decimals={infoToken[0]?.decimals}
              />
            </BoxContent>
          </div>
          <div className="mt-4">
            <Tabs defaultValue="Transfers" className="mt-0">
              <TabsList className="gap-2 mb-1 bg-transparent">
                <TabsTrigger
                  value="Transfers"
                  className="text-white border border-white"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="Holder"
                  className="text-white border border-white"
                >
                  Holder
                </TabsTrigger>
                <TabsTrigger
                  value="Contract"
                  className="text-white border border-white"
                >
                  Contract
                </TabsTrigger>
              </TabsList>
              <BoxContent extendClassName="min-h-[200px] p-4 mt-2">
                <TabsContent value="Transfers">
                  <Transfers />
                </TabsContent>
                <TabsContent value="Holder">
                  <Holder />
                </TabsContent>
                <TabsContent value="Contract">
                  <InteractContract tokenDetails={infoToken[0]} />
                </TabsContent>
              </BoxContent>
            </Tabs>
          </div>
          <Loading isLoading={isLoadingInfo} />
        </div>
      ) : (
        <div>Some thing went wrong</div>
      )}
    </div>
  );
};

export default DetailToken;
