import { useRoutes } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import path from './constants/path';
import DashBoardPage from './pages/DashBoardPage';
import CreateToken from './pages/CreateToken';
import DetailToken from './pages/DetailToken';

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
            ],
        },
    ]);
    return routeElements;
};

export default useRouterElements;
