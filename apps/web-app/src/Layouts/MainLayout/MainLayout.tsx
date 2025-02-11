import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import HeaderMainLayout from "../components/HeaderMainLayout";

const MainLayout = () => {
  return (
    <main className="min-h-screen w-full bg-[F2F5F9]">
      <SideNav />
      <div className='ml-[290px]'>
        <HeaderMainLayout />
        <Outlet />
      </div>
    </main>
  );
};

export default MainLayout;
