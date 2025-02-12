import IconCrypto from "@/assets/icons/IconCrypto";
import path from "@/constants/path";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import LogoLink from "../LogoLink";

const listNav = [
  {
    group: "Dashboards",
    listNav: [
      {
        icon: <IconCrypto />,
        name: "Dashboard",
        to: path.dashBoard,
      },
    ],
  },
];

const SideNav = () => {
  return (
    <div className="w-[290px] fixed inset-0 p-[20px] bg-[#11192A] text-[#ffffffb3]">
      <LogoLink />
      <span className="bg-[#ffffff1a] block mt-7 h-[1px]" />
      <div className="mt-3">
        {listNav.map((item, index) => (
          <div key={index} className="py-2">
            <div className="text-[#ffffff80] text-[12px] font-bold uppercase">
              {item.group}
            </div>
            {item.listNav.map((itemNav, indexNav) => (
              <NavLink
                key={indexNav}
                to={itemNav.to}
                className={({ isActive }) =>
                  classNames(
                    "py-3 px-7 transition-all duration-250 mt-2 rounded-[10px] flex items-center justify-start hover:text-white hover:bg-[#ffffff0f]",
                    {
                      "text-white bg-[#ffffff0f]": isActive,
                      "text-[#ffffffb3]": !isActive,
                    }
                  )
                }
              >
                {itemNav.icon}
                <div className="ml-2 text-current font-semibold">
                  {itemNav.name}
                </div>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
