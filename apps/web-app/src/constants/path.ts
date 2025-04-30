
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
  DAODetail: "/dao/detail/:idDao",
  DAODetailProposal: "/dao/detail/:idDao/proposal/:idProposal",
  DAOCreateProposal: "/dao/proposal/create/:id",
} as const;

export const routesPathToken: IRoute[] = [
  {
    path: path.dashBoard,
    name: "List",
  },
  {
    path: path.createToken,
    name: "Create Token",
  },
  {
    path: path.detailToken,
    name: "Detail Token",
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
    name: "Detail DAO",
  },
  {
    path: path.DAOCreateProposal,
    name: "Proposal",
  },
  {
    path: path.DAOCreateProposal,
    name: "Proposal",
  },
  {
    path: path.DAODetailProposal,
    name: "Detail Proposal",
  },
];

export default path;
