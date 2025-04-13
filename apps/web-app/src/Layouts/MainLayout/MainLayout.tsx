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
        <div className="bg-gradient-to-r from-gray-800/5 to-gray-900/5 backdrop-blur-sm py-6 px-2 border-t md:px-9 md:py-6 flex items-center gap-6 shadow-sm border-b border-slate-200/20">
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <IconEthereum  />
          </div>
          <div className="space-y-1">
            <h1 className="text-slate-900 text-2xl md:text-3xl font-bold tracking-tight">
              Welcome
            </h1>
            <h2 className="text-slate-600 text-base md:text-lg font-normal">
              Today is a good day to start trading crypto assets!
            </h2>
          </div>
        </div>
        <div className="min-h-[calc(100vh-224px)] bg-gradient-to-b from-gray-900 to-gray-950 p-6">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default MainLayout;
