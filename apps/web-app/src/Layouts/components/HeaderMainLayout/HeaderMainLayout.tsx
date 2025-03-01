import IconMenu from "@/assets/icons/IconMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideNav from "../SideNav";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb/DynamicBreadcrumb";
import ConnectButtonCustom from "@/components/ConnectButtonCustom/ConnectButtonCustom";
const HeaderMainLayout = () => {
  return (
    <div className="h-[60px] md:h-[80px] bg-[#fffffff2] px-5 shadow-headerMain backdrop-blur-[3px] flex items-center justify-between">
      <div>
        <DynamicBreadcrumb />
      </div>
      <div className="flex items-center">
        <ConnectButtonCustom />
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-[#5569ff] p-2 ml-2">
                <IconMenu />
              </button>
            </SheetTrigger>
            <SheetContent side={"left"} className="w-[290px]">
              <SideNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default HeaderMainLayout;
