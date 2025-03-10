import { ClipboardListIcon } from "lucide-react";
import Transfer from "./query/Transfer/Transfer";
import { FC } from "react";
import Approve from "./query/Approve/Approve";
import TransferFrom from "./query/TransferFrom/TransferFrom";

const WriteContract: FC<{ decimals: number }> = ({ decimals }) => {
  return (
    <div>
      <div className="flex items-center text-[12px] mb-4 mt-2">
        <ClipboardListIcon className="w-4 h-4" />
        <span className="ml-1">Write Contract</span>
      </div>
      <div>
        <Transfer decimals={decimals} />
        <Approve decimals={decimals}/>
        <TransferFrom decimals={decimals}/>
      </div>
    </div>
  );
};

export default WriteContract;
