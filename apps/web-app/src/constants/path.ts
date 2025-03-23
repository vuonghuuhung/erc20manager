
export interface IRoute {
  name: string;
  path: string;
}

const path = {
  dashBoard: "/",
  createToken: "/token/create",
  detailToken: "/token/detail/:id",
  DAOCreate: "/dao/create",
  DAODashboard: "/dao",
  DAODetail: "/dao/detail/:id",
} as const;

export const routesPathToken: IRoute[] = [
  {
    path: path.dashBoard,
    name: "List",
  },
  {
    path: path.createToken,
    name: "Create",
  },
  {
    path: path.detailToken,
    name: "Detail",
  },
];

export const routesPathDAO: IRoute[] = [
  {
    path: path.DAODashboard,
    name: "List",
  },
  {
    path: path.DAOCreate,
    name: "Create",
  },
  {
    path: path.DAODetail,
    name: "Detail",
  },
];

export default path;
