import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import HeaderMainLayout from "../components/HeaderMainLayout";
const MainLayout = () => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-950 p-6">
      <div className="hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-[290px] ml-0">
        <HeaderMainLayout />
        <div className="min-h-[calc(100vh-60px)] md:min-h-[calc(100vh-80px)]">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default MainLayout;
