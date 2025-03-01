import { IRoute, routesPath } from "@/constants/path";
import { useEffect, useState } from "react";
import { Link, matchRoutes, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
const DynamicBreadcrumb = () => {
  const location = useLocation();
  const [crumbs, setCrumbs] = useState<IRoute[]>([]);

  const getPaths = () => {
    const allRoutes = matchRoutes(routesPath, location);

    const matchedRoute = allRoutes ? allRoutes[0] : null;
    let breadcrumbs: IRoute[] = [];
    if (matchedRoute) {
      breadcrumbs = routesPath
        .filter((x) => matchedRoute.route.path.includes(x.path))
        .map(({ path, ...rest }) => ({
          path: Object.keys(matchedRoute.params).length
            ? Object.keys(matchedRoute.params).reduce(
                (path, param) =>
                  path.replace(
                    `:${param}`,
                    matchedRoute.params[param] as string
                  ),
                path
              )
            : path,
          ...rest,
        }));
    }
    setCrumbs(breadcrumbs);
  };

  const listNavSub = crumbs.filter((_, index) => crumbs.length !== index + 1);

  useEffect(() => {
    getPaths();
  }, [location]);

  return (
    <div>
      <nav aria-label="breadcrumb" className="md:block hidden">
        <ol className="flex items-center gap-2">
          {crumbs.map((x: IRoute, key: number) =>
            crumbs.length === key + 1 ? (
              <li
                key={key}
                className="text-[18px] font-medium uppercase cursor-default"
              >
                {x.name}
              </li>
            ) : (
              <li key={key} className="text-[18px] font-normal uppercase">
                <Link to={x.path}>{x.name}</Link>
                <span className="ml-2">{">"}</span>
              </li>
            )
          )}
        </ol>
      </nav>
      <div className="md:hidden block">
        <DropdownMenu>
          <DropdownMenuTrigger>
            {crumbs.map(
              (x: IRoute, key: number) =>
                crumbs.length === key + 1 && (
                  <div
                    key={key}
                    className="text-[18px] flex items-center cursor-pointer font-medium uppercase"
                  >
                    {x.name}
                    {listNavSub.length > 0 && (
                      <ChevronDown className="ml-1 mt-1" />
                    )}
                  </div>
                )
            )}
          </DropdownMenuTrigger>
          {listNavSub.length > 0 && (
            <DropdownMenuContent align="start">
              {crumbs.map(
                (x: IRoute, key: number) =>
                  crumbs.length !== key + 1 && (
                    <Link
                      key={key}
                      to={x.path}
                      className="text-[16px] font-medium uppercase cursor-pointer block w-full"
                    >
                      <DropdownMenuItem className="py-1 cursor-pointer">
                        {x.name}
                      </DropdownMenuItem>
                    </Link>
                  )
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
};
export default DynamicBreadcrumb;
