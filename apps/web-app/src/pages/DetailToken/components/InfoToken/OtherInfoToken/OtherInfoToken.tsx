import { FC } from "react";
import CopyComponent from "@/components/CopyComponent/CopyComponent";
const OtherInfoToken: FC<{ decimals?: number; tokenAddress?: string }> = ({
  decimals,
  tokenAddress,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[16px] font-medium text-[#212529]">Other Info</h4>
      <div>
        <div className="text-[#6c757d] text-[14px]">{`Token Contract (WITH ${decimals} Decimals)`}</div>
        <div className="flex items-center break-all gap-1">
          <div className="text-[14px] font-normal mt-1 text-[#212529]">
            {tokenAddress}
          </div>
          <CopyComponent tokenAddress={tokenAddress} className="ml-1"/>
        </div>
      </div>
    </div>
  );
};

export default OtherInfoToken;
