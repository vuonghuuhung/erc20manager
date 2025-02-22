import { ERC20Factory__factory } from "@repo/contracts";
import { useReadContract } from "wagmi";

const DashBoardPage = () => {
  const { data } = useReadContract({
    address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    abi: ERC20Factory__factory.abi,
    functionName: "getListOfERC20ManagerCreated",
    args: [],
  });

  console.log(data);

  return (
    <>
      <div className="h-[5000px]">Dashboard</div>
    </>
  );
};

export default DashBoardPage;
