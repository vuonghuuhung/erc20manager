import IconPassed from "@/assets/icons/IconRejected";

const ProposalItem = () => {
  return (
    <div className="hidden mt-1 h-12 flex-row items-center gap-6 p-3 md:flex bg-[#f3f6f80d] rounded-md cursor-pointer transition duration-300 hover:bg-[#f3f6f81a]">
      <p className="shrink-0 font-mono text-[12px] text-[#f3f6f880]">000991</p>
      <div className="w-20 shrink-0">
        <div className="link-text flex flex-row items-center gap-1.5 text-[#39a699f2]">
          <IconPassed />
          <p className="shrink-0 truncate text-current text-[13px]">Passed</p>
        </div>
      </div>
      <div className="flex min-w-0 grow flex-row items-center gap-2">
        <p className="body-text grow truncate text-[14px] text-white">
          Community Pool USDC deployment via Hydro
        </p>
      </div>
      <p className="caption-text shrink-0 break-words text-right font-mono text-[12px] text-[#f3f6f880]">
        March 19
      </p>
    </div>
  );
};

export default ProposalItem;
