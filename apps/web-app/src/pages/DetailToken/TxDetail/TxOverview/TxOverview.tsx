import { cn } from "@/lib/utils";
import { CircleCheck, CircleHelp } from "lucide-react";
interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  isHash?: boolean;
  isAddress?: boolean;
}

const InfoRow = ({ label, value, isHash, isAddress }: InfoRowProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex items-center gap-2 text-gray-500 lg:min-w-[300px]">
        <CircleHelp className="w-4 h-4" />
        <span className="text-gray-500 min-w-32">{label}:</span>
      </div>
      <div
        className={cn(
          "font-medium break-all",
          (isHash || isAddress) && "font-mono text-blue-600"
        )}
      >
        {value}
      </div>
    </div>
  );
};

const TxOverview = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-headerMain">
      <h1 className="text-2xl font-bold mb-6">Token Transfer</h1>

      <div className="space-y-6">
        <div className="space-y-4">
          <InfoRow
            label="Transaction Hash"
            value="0x3adbfb92fba10b4610ebfa458e253f9c72a7ad94a488da7f5dd9e20733d4fb2d"
            isHash
          />
          <InfoRow
            label="Status"
            value={
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CircleCheck className="w-4 h-4 mr-2" />
                Success
              </span>
            }
          />
          <InfoRow
            label="Block"
            value={
              <a href="#" className="text-blue-600">
                22426420
              </a>
            }
          />
          <InfoRow
            label="Timestamp"
            value="11 secs ago (May-06-2025 06:21:35 PM UTC)"
          />
        </div>

        {/* Token Transfer Details */}
        <div className="pt-6 border-t">
          <div className="space-y-4">
            <InfoRow
              label="From"
              value="0xC1DA33E8d60dAf4F93A52357A57a07f44C45759"
              isAddress
            />
            <InfoRow
              label="To"
              value="0x5F4145CC7ebB9ef75FF80F8BBD2dcd3Cd4D9153d9"
              isAddress
            />
            <InfoRow
              label="Token"
              value={
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 ">USDT</span>
                  <span className="text-gray-500">(Tether USD)</span>
                </div>
              }
            />
            <InfoRow label="Value" value="54.526656 USDT ($54.52)" />
          </div>
        </div>

        {/* Transaction Fee */}
        <div className="pt-6 border-t">
          <div className="space-y-4">
            <InfoRow
              label="Gas Price"
              value="0.596482261 Gwei (0.000000000596482261 ETH)"
            />
            <InfoRow
              label="Transaction Fee"
              value="0.000037703047235549 ETH ($0.07)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxOverview;
