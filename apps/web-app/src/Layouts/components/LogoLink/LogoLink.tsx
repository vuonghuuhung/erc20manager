import path from "@/constants/path";
import logo from "@/assets/images/logoWeb.png";
import { Link } from "react-router-dom";

const LogoLink = () => {
  return (
    <Link to={path.dashBoard} className="block relative w-[65px] h-[65px]">
      <img src={logo} alt="logo" className="block object-cover" />
      <span className="block w-[40px] h-[12px] bg-white absolute z-[-1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
    </Link>
  );
};

export default LogoLink;
