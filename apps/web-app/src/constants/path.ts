
export interface IRoute {
  name: string;
  path: string;
}

const path = {
  dashBoard: "/",
  createToken: "/token/create",
  detailToken: "/token/detail/:id",
} as const;

export const routesPath: IRoute[] = [
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

export default path;
