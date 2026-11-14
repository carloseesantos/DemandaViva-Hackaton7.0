import type { RouteObject } from 'react-router';
import { AppLayout } from './layout/AppLayout';
import { NotFoundPage } from './layout/NotFoundPage';
import { PlaceholderPage } from './layout/PlaceholderPage';
import { RouteErrorPage } from './layout/RouteErrorPage';
import { APP_ROUTES } from './routes';

export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      ...APP_ROUTES.map((route) => ({
        path: route.path,
        element: <PlaceholderPage route={route} />,
      })),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
