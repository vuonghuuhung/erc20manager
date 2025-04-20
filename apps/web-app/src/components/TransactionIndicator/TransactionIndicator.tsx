import useListTransactionStore from "@/store/listTransactionState";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import TxWaitStatusItem from "../TxWaitStatusItem/TxWaitStatusItem";

const TransactionIndicator = () => {
  const [expanded, setExpanded] = useState(false);
  const { listTransaction } = useListTransactionStore();
  // console.log("listTransaction", listTransaction);

  return (
    <div
      className={`${listTransaction.length > 0 ? "flex flex-col" : "hidden"} cursor-pointer pt-0 fixed bottom-6 overflow-hidden right-6 z-50 bg-zinc-800 text-white rounded-xl shadow-lg transition-all duration-300 ${
        expanded
          ? "md:w-[450px] w-[80vw] h-[75vh]"
          : "lg:w-[300px] w-[56px] h-[56px]"
      }`}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-3 cursor-pointer p-4 ${expanded ? "pb-4" : ""}`}
      >
        <div
          className={`text-[16px] font-semibold lg:block hidden ${expanded ? "!block" : ""}`}
        >
          Transactions: {listTransaction.length}
        </div>
        <ChevronDown
          className={`transition-transform ${expanded ? "rotate-180 ml-auto " : "mx-auto lg:ml-auto lg:mr-0 mt-1 lg:mt-0"}`}
          size={18}
        />
      </div>

      <div className="overflow-auto p-4">
        <div className="space-y-2">
          {listTransaction.map((item) => (
            <TxWaitStatusItem
              key={item.hash}
              hash={item.hash}
              functionName={item.functionName}
              urlReCall={item.urlReCall}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionIndicator;
