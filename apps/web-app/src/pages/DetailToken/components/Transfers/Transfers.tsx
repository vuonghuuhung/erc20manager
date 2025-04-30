import {
  columnsTransfers,
  Transfer,
} from "@/components/ColumnTableTransfers/ColumnTableTransfers";
import { DataTableTransfers } from "@/components/DataTableTransfers/DataTableTransfers";

const Transfers = () => {
  const data: Transfer[] = [
    {
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      age: new Date(Date.now() - 2 * 60 * 1000),
      method: "Transfer",
      block: 12345678,
      from: "0xabcdef1234567890abcdef1234567890abcdef12",
      to: "0x9876543210fedcba9876543210fedcba98765432",
      amount: "1000000",
    },
    {
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      age: new Date(Date.now() - 2 * 60 * 1000),
      method: "Transfer",
      block: 12345678,
      from: "0xabcdef1234567890abcdef1234567890abcdef12",
      to: "0x9876543210fedcba9876543210fedcba98765432",
      amount: "1000000",
    },
    {
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      age: new Date(Date.now() - 2 * 60 * 1000),
      method: "Transfer",
      block: 12345678,
      from: "0xabcdef1234567890abcdef1234567890abcdef12",
      to: "0x9876543210fedcba9876543210fedcba98765432",
      amount: "1000000",
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-[#E4E7EC]">
      <DataTableTransfers columns={columnsTransfers} data={data} />
    </div>
  );
};

export default Transfers;
