import useListTransactionStore from "@/store/listTransactionState";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import TxWaitStatusItem from "../TxWaitStatusItem/TxWaitStatusItem";

const TransactionIndicator = () => {
  const [expanded, setExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { listTransaction } = useListTransactionStore();
  useEffect(() => {
    if (listTransaction.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [listTransaction]);

  return (
    <div
      className={`${isOpen ? "flex flex-col" : "hidden"} cursor-pointer pt-0 fixed bottom-6 overflow-hidden right-6 z-50 bg-zinc-800 text-white rounded-xl shadow-lg transition-all duration-300 ${
        expanded
          ? "md:w-[450px] w-[80vw] h-[75vh]"
          : "lg:w-[300px] w-[56px] h-[56px]"
      }`}
    >
      <div className={`flex items-center justify-between cursor-pointer`}>
        <div
          onClick={() => setExpanded(!expanded)}
          className={`text-[16px] p-4 font-semibold flex-1 lg:block hidden ${expanded ? "!block" : ""}`}
        >
          Transactions: {listTransaction.length}
        </div>
        <div>
          <button onClick={() => setExpanded(!expanded)} className="py-4 px-3">
            <ChevronDown
              className={`transition-transform ${expanded ? "rotate-180 ml-auto " : "mx-auto lg:ml-auto lg:mr-0 mt-1 lg:mt-0"}`}
              size={18}
            />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setExpanded(false);
            }}
            className="py-4 px-3"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
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
