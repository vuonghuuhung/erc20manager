import { useRoutes } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import path from './constants/path';
import DashBoardPage from './pages/DashBoardPage';
import CreateToken from './pages/CreateToken';
import DetailToken from './pages/DetailToken';
import DAOCreate from './pages/DAO/DAOCreate/DAOCreate';
import DAODashboard from './pages/DAO/DAODashboard/DAODashboard';
import DAODetail from './pages/DAO/DAODetail/DAODetail';
import CreateProposal from './pages/DAO/CreateProposal/CreateProposal';
import ProposalDetail from './pages/DAO/ProposalDetail/ProposalDetail';
import TxDetail from './pages/DetailToken/TxDetail/TxDetail';

const useRouterElements = () => {
    const routeElements = useRoutes([
        {
            path: '',
            element: <MainLayout />,
            children: [
                {
                    path: path.dashBoard,
                    element: <DashBoardPage />,
                },
                {
                    path: path.createToken,
                    element: <CreateToken />,
                },
                {
                    path: path.detailToken,
                    element: <DetailToken />,
                },
                {
                    path: path.txDetail,
                    element: <TxDetail />,
                },
                {
                    path: path.DAOCreate,
                    element: <DAOCreate />,
                },
                {
                    path: path.DAODashboard,
                    element: <DAODashboard />,
                },
                {
                    path: path.DAODetail,
                    element: <DAODetail />,
                },
                {
                    path: path.DAOCreateProposal,
                    element: <CreateProposal />,
                },
                {
                    path: path.DAODetailProposal,
                    element: <ProposalDetail />,
                },
            ],
        },
    ]);
    return routeElements;
};

export default useRouterElements;
