import { useParams } from "react-router-dom";
import { CoinsIcon } from "lucide-react";
import Loading from "@/components/Loading/Loading";
import BoxContent from "@/components/BoxContent";
import useTokenDetails from "@/hooks/useTokenDetails";
import OverviewToken from "./components/InfoToken/OverviewToken/OverviewToken";
import MarketToken from "./components/InfoToken/MarketToken/MarketToken";
import OtherInfoToken from "./components/InfoToken/OtherInfoToken/OtherInfoToken";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InteractContract from "./components/InteractContract/InteractContract";
import { useEffect } from "react";
import useTokenDetailStore from "@/store/tokenDetailState";

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
          <div className="flex items-center pb-5 border-b border-b-[#dadbdd]">
            <CoinsIcon className="w-10 h-10" />
            <h2 className="ml-3 mr-1 text-[20px] font-semibold">
              {infoToken ? infoToken[0]?.name : ""}
            </h2>
            <h3 className="text-[20px] text-[#6c757d] font-semibold">
              {infoToken ? `(${infoToken[0]?.symbol})` : ""}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
            <BoxContent extendClassName="col-span-3 lg:col-span-1 rounded-[6px] p-4">
              <OverviewToken totalSupply={infoToken[0]?.totalSupply} />
            </BoxContent>
            <BoxContent extendClassName="col-span-3 lg:col-span-1 rounded-[6px] p-4">
              <MarketToken />
            </BoxContent>
            <BoxContent extendClassName="col-span-3 lg:col-span-1 rounded-[6px] p-4">
              <OtherInfoToken
                tokenAddress={id}
                decimals={infoToken[0]?.decimals}
              />
            </BoxContent>
          </div>
          <div className="mt-4">
            <Tabs defaultValue="Transfers" className="mt-0">
              <TabsList className="gap-2 mb-1 bg-transparent">
                <TabsTrigger value="Transfers">Transfers</TabsTrigger>
                <TabsTrigger value="Contract">Contract</TabsTrigger>
              </TabsList>
              <BoxContent extendClassName="min-h-[200px] p-4">
                <TabsContent value="Transfers">
                  Make changes to your account here.
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
