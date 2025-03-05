const MarketToken = () => {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[16px] font-medium text-[#212529]">Market</h4>
      <div>
        <div className="text-[#6c757d] text-[14px]">Price</div>
        <div className="text-[14px] font-normal mt-1 text-[#212529]">
          $1.00 @ 0.000451 ETH (+0.06%)
        </div>
      </div>
      <div>
        <div className="text-[#6c757d] text-[14px]">Onchain Market Cap</div>
        <div className="text-[14px] font-normal mt-1 text-[#212529]">
          $76,849,665,409.02
        </div>
      </div>
      <div>
        <div className="text-[#6c757d] text-[14px]">
          Circulating Supply Market Cap
        </div>
        <div className="text-[14px] font-normal mt-1 text-[#212529]">
          $142,061,719,398.00
        </div>
      </div>
    </div>
  );
};

export default MarketToken;
