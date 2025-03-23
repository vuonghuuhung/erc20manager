import IconCrypto from "@/assets/icons/IconCrypto";
import path, { routesPathDAO, routesPathToken } from "@/constants/path";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import LogoLink from "../LogoLink";

const listNav = [
  {
    group: "ERC20",
    listNav: [
      {
        icon: <IconCrypto />,
        name: "Dashboard",
        to: path.dashBoard,
        listNavChild: routesPathToken,
      },
    ],
  },
  {
    group: "DAO",
    listNav: [
      {
        icon: <IconCrypto />,
        name: "DAO DAO",
        to: path.DAODashboard,
        listNavChild: routesPathDAO,
      },
    ],
  },
];

const SideNav = () => {
  const { pathname } = useLocation();

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
            {item.listNav.map((itemNav, indexNav) => {
              const isActive =
                (pathname === itemNav.to) ||
                itemNav.listNavChild.some((child) => {
                  if (child.path.includes(":")) {
                    return pathname.includes(child.path.split(":")[0]);
                  }
                  return pathname.includes(child.path) && child.path !== '/';
                });
              return (
                <Link
                  key={indexNav}
                  to={itemNav.to}
                  className={classNames(
                    "py-3 px-7 transition-all duration-250 mt-2 rounded-[10px] flex items-center justify-start hover:text-white hover:bg-[#ffffff0f]",
                    {
                      "text-white bg-[#ffffff0f]": isActive,
                      "text-[#ffffffb3]": !isActive,
                    }
                  )}
                >
                  {itemNav.icon}
                  <div className="ml-2 text-current font-semibold">
                    {itemNav.name}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
