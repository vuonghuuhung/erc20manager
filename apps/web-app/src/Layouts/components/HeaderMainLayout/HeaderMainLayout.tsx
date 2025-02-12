import IconMenu from "@/assets/icons/IconMenu";
import LogoLink from "../LogoLink";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import SideNav from "../SideNav";
const HeaderMainLayout = () => {
  return (
    <div className="h-[80px] bg-[#fffffff2] px-5 shadow-headerMain flex items-center md:justify-end justify-between">
      <div className="md:hidden">
        <LogoLink />
      </div>
      <div className="flex items-center">
        <div>ConnectButton</div>
       <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-[#5569ff] p-2 ml-5">
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
