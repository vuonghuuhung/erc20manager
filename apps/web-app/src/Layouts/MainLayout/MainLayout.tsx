import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import HeaderMainLayout from "../components/HeaderMainLayout";
import IconEthereum from "@/assets/icons/IconEthereum";
const MainLayout = () => {
  return (
    <main className="min-h-screen w-full bg-[#F2F5F9]">
      <div className="hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-[290px] ml-0">
        <HeaderMainLayout />
        <div className="bg-[#ffffff80] py-6 px-2 md:p-9 flex items-center shadow-titleShadow">
          <div>
            <IconEthereum />
          </div>
          <div>
            <h1 className="text-[#223354] text-[25px] font-bold">Welcome</h1>
            <h2 className="text-[#223354b3] text-[16px] font-normal">
              Today is a good day to start trading crypto assets!
            </h2>
          </div>
        </div>
        <div className="p-4 md:p-7">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default MainLayout;
