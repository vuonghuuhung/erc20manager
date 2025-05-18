import { ColumnTableHolder } from "@/components/ColumnTableHolder/ColumnTableHolder";
import { DataTableTransfers } from "@/components/DataTableTransfers/DataTableTransfers";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

const data = [
  {
    rank: 1,
    chainName: "Binance: Hot Wallet 20",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    quantity: "1,000,000",
    percentage: "20.5%",
    value: "$2,500,000",
  },
  {
    rank: 2,
    chainName: "Binance: Hot Wallet 20",
    address: "0x8901DaECbfF9A3e0998BEc9A7Be9730cb4a47BB1",
    quantity: "750,000",
    percentage: "15.3%",
    value: "$1,875,000",
  },
  {
    rank: 3,
    chainName: "Binance: Hot Wallet 20",
    address: "0x3F4a286bD32d7c8a53002f51b04F157691174133",
    quantity: "500,000",
    percentage: "10.2%",
    value: "$1,250,000",
  },
  {
    rank: 4,
    chainName: "Binance: Hot Wallet 20",
    address: "0x1234567890123456789012345678901234567890",
    quantity: "250,000",
    percentage: "5.1%",
    value: "$625,000",
  },
  {
    rank: 5,
    chainName: "Binance: Hot Wallet 20",
    address: "0xabcdef0123456789abcdef0123456789abcdef01",
    quantity: "100,000",
    percentage: "2.0%",
    value: "$250,000",
  },
];

const Holder = () => {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E4E7EC]">
        <div className="text-sm text-[#212529]">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-[#f8f9fa] px-3 py-1.5 rounded-lg">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Top holders</span>
            </div>
          </div>
          <div className="text-xs mt-2 text-gray-500">
            Showing top holders by balance
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#E4E7EC] hover:bg-[#f8f9fa] disabled:bg-[#f8f9fa] py-1 px-2 h-auto"
              >
                <ChevronLeft />
              </Button>
              <div className="text-[12px] py-1 px-2 bg-[#f8f9fa] text-[#6c757d] rounded-lg border border-[#E4E7EC]">
                Page {1} of {2}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[#E4E7EC] hover:bg-[#f8f9fa] disabled:bg-[#f8f9fa] py-1 px-2 h-auto"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DataTableTransfers columns={ColumnTableHolder} data={data} />
    </div>
  );
};

export default Holder;
