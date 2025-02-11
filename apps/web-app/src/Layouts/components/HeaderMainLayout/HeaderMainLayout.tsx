import LogoLink from "../LogoLink";

const HeaderMainLayout = () => {
  return (
    <div className="h-[80px] bg-[#fffffff2] px-5 shadow-headerMain flex items-center md:justify-end justify-between">
        <div className="md:hidden">
            <LogoLink />
        </div>
        <div>
            ConnectButton
        </div>
    </div>
  );
};

export default HeaderMainLayout;
