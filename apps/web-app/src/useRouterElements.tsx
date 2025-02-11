import { useRoutes } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import path from './constants/path';
import DashBoardPage from './pages/DashBoardPage';

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
            ],
        },
    ]);
    return routeElements;
};

export default useRouterElements;
