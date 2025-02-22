import { IRoute, routesPath } from "@/constants/path";
import { useEffect, useState } from "react";
import { Link, matchRoutes, useLocation } from "react-router-dom";

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

  useEffect(() => {
    getPaths();
  }, [location]);

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-2">
          {crumbs.map((x: IRoute, key: number) =>
            crumbs.length === key + 1 ? (
              <li key={key}>{x.name}</li>
            ) : (
              <li key={key}>
                <Link to={x.path}>{x.name}</Link>
                <span className="ml-2">{">"}</span>
              </li>
            )
          )}
        </ol>
      </nav>
    </div>
  );
};
export default DynamicBreadcrumb;
