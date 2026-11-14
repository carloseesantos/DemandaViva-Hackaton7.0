import type { RouteObject } from 'react-router';
import { AppLayout } from './layout/AppLayout';
import { NotFoundPage } from './layout/NotFoundPage';
import { RouteErrorPage } from './layout/RouteErrorPage';
import { HomePage } from '../pages/HomePage';
import { InterviewPage } from '../pages/InterviewPage';
import { ResultPage } from '../pages/ResultPage';
import { BriefPage } from '../pages/BriefPage';
import { AcPanelPage } from '../pages/AcPanelPage';
import { ClusterPage } from '../pages/ClusterPage';
import { StartupCallsPage } from '../pages/StartupCallsPage';
import { StartupCallPage } from '../pages/StartupCallPage';
import { RegionalPage } from '../pages/RegionalPage';

export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/lojista/diagnostico', element: <InterviewPage /> },
      { path: '/lojista/resultado/:needId', element: <ResultPage /> },
      { path: '/briefing/:needId', element: <BriefPage /> },
      { path: '/ac/painel', element: <AcPanelPage /> },
      { path: '/ac/clusters/:clusterId', element: <ClusterPage /> },
      { path: '/startup/chamadas', element: <StartupCallsPage /> },
      { path: '/startup/chamadas/:callId', element: <StartupCallPage /> },
      { path: '/regional', element: <RegionalPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
