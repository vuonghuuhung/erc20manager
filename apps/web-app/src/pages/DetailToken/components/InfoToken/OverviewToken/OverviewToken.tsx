import { FC } from "react";

const OverviewToken: FC<{ totalSupply: string }> = ({ totalSupply }) => {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[16px] font-medium text-[#212529]">Overview</h4>
      <div>
        <div className="text-[#6c757d] text-[14px]">Max Total Supply</div>
        <div className="text-[14px] font-normal mt-1 text-[#212529]">
          {totalSupply}
        </div>
      </div>
      <div>
        <div className="text-[#6c757d] text-[14px]">Holders</div>
        <div className="text-[14px] font-normal mt-1 text-[#212529]">
          6,952,544
        </div>
      </div>
      <div>
        <div className="text-[#6c757d] text-[14px]">Total Transfers</div>
        <div className="text-[14px] font-normal mt-1 text-[#212529]">
          More than 283,503,161
        </div>
      </div>
    </div>
  );
};

export default OverviewToken;
