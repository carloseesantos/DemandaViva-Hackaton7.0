import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-800.css';
import './styles/brand-tokens.css';
import './styles/base.css';
import './styles/pages.css';
import { createDependencies } from './app/createDependencies';
import { DependenciesProvider } from './app/DependenciesProvider';
import { readRuntimeConfig } from './app/env';
import { appRoutes } from './app/router';

const runtime = readRuntimeConfig(import.meta.env);
for (const issue of runtime.issues) console.warn(`[DEMANDA VIVA] ${issue}`);

const router = createBrowserRouter(appRoutes);
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Elemento #root ausente em index.html.');

createRoot(rootElement).render(
  <StrictMode>
    <DependenciesProvider value={createDependencies(runtime)}>
      <RouterProvider router={router} />
    </DependenciesProvider>
  </StrictMode>,
);
