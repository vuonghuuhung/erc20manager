import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TokenDetails } from "@/hooks/useTokenDetails";
import { ClipboardListIcon } from "lucide-react";
import BalanceOf from "./query/BalanceOf/BalanceOf";
import Allowance from "./query/Allowance/Allowance";

const ReadContract = ({
  name,
  decimals,
  symbol,
  totalSupply,
}: TokenDetails) => {
  return (
    <div>
      <div className="flex items-center text-[12px] mb-4 mt-2">
        <ClipboardListIcon className="w-4 h-4" />
        <span className="ml-1">Read Contract Information</span>
      </div>
      <Collapsible className="border-[#e9ecef] border rounded-xl overflow-hidden mb-2">
        <CollapsibleTrigger className="w-full text-left bg-[#f8f9fa] py-1 px-3">
          name
        </CollapsibleTrigger>
        <CollapsibleContent className="py-2 px-3">{name}</CollapsibleContent>
      </Collapsible>
      <Collapsible className="border-[#e9ecef] border rounded-xl overflow-hidden mb-2">
        <CollapsibleTrigger className="w-full text-left bg-[#f8f9fa] py-1 px-3">
          decimals
        </CollapsibleTrigger>
        <CollapsibleContent className="py-2 px-3">
          {decimals}
        </CollapsibleContent>
      </Collapsible>
      <Collapsible className="border-[#e9ecef] border rounded-xl overflow-hidden mb-2">
        <CollapsibleTrigger className="w-full text-left bg-[#f8f9fa] py-1 px-3">
          symbol
        </CollapsibleTrigger>
        <CollapsibleContent className="py-2 px-3">{symbol}</CollapsibleContent>
      </Collapsible>
      <Collapsible className="border-[#e9ecef] border rounded-xl overflow-hidden mb-2">
        <CollapsibleTrigger className="w-full text-left bg-[#f8f9fa] py-1 px-3">
          totalSupply
        </CollapsibleTrigger>
        <CollapsibleContent className="py-2 px-3">
          {totalSupply}
        </CollapsibleContent>
      </Collapsible>
      <BalanceOf />
      <Allowance />
    </div>
  );
};

export default ReadContract;
