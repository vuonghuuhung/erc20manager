import { IRoute, routesPathDAO, routesPathToken } from "@/constants/path";
import { useEffect, useState } from "react";
import { Link, matchRoutes, useLocation, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
const DynamicBreadcrumb = () => {
  const location = useLocation();
  const params = useParams();

  const [crumbs, setCrumbs] = useState<IRoute[]>([]);

  const getPaths = () => {
    const routerCheck = location.pathname.includes("dao")
      ? routesPathDAO
      : routesPathToken;
    const allRoutes = matchRoutes(routerCheck, location);

    const matchedRoute = allRoutes ? allRoutes[0] : null;

    let breadcrumbs: IRoute[] = [];
    if (matchedRoute) {
      breadcrumbs = routerCheck
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
    <div className="w-full">
      <nav aria-label="breadcrumb" className="md:block hidden">
        <ol className="flex items-center gap-2">
          {crumbs.map((x: IRoute, key: number) =>
            crumbs.length === key + 1 ? (
              <li
                key={key}
                className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 cursor-default"
              >
                {x.name}
              </li>
            ) : (
              <li key={key} className="flex items-center">
                <Link
                  to={
                    x.path.includes(":idDao")
                      ? `/dao/detail/${params.idDao}`
                      : x.path
                  }
                  // to={x.path}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-lg"
                >
                  {x.name}
                </Link>
                <span className="mx-2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </li>
            )
          )}
        </ol>
      </nav>

      <div className="md:hidden block">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center px-4 py-2 text-lg font-medium rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
            {crumbs.map(
              (x: IRoute, key: number) =>
                crumbs.length === key + 1 && (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                  >
                    {x.name}
                    {listNavSub.length > 0 && (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                )
            )}
          </DropdownMenuTrigger>
          {listNavSub.length > 0 && (
            <DropdownMenuContent
              align="start"
              className="bg-gray-900 border border-gray-700/50"
            >
              {crumbs.map(
                (x: IRoute, key: number) =>
                  crumbs.length !== key + 1 && (
                    <Link key={key} to={x.path} className="w-full">
                      <DropdownMenuItem className="py-2 px-4 text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 cursor-pointer transition-colors duration-200">
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
