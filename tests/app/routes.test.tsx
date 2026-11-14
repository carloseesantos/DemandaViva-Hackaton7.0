import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { createDependencies } from '../../src/app/createDependencies';
import { DependenciesProvider } from '../../src/app/DependenciesProvider';
import { appRoutes } from '../../src/app/router';
import { APP_ROUTES } from '../../src/app/routes';

function renderAt(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(
    <DependenciesProvider value={createDependencies({ supabase: null, issues: [] })}>
      <RouterProvider router={router} />
    </DependenciesProvider>,
  );
}

function concretePath(path: string): string {
  return path.replace(/:([A-Za-z]+)/g, (_match, name: string) => `exemplo-${name}`);
}

describe('rotas placeholder da SPA', () => {
  it.each(APP_ROUTES.map((route) => [route.id, route] as const))('renderiza %s em acesso direto', (_id, route) => {
    renderAt(concretePath(route.path));
    expect(screen.getByRole('heading', { level: 1, name: route.title })).toBeInTheDocument();
  });

  it('expõe o parâmetro de rota profunda', () => {
    renderAt('/lojista/resultado/e0a11000-0000-4000-8000-000000000001');
    expect(screen.getByText('e0a11000-0000-4000-8000-000000000001')).toBeInTheDocument();
  });

  it('mostra 404 da SPA para caminho desconhecido', () => {
    renderAt('/nao/existe');
    expect(screen.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeInTheDocument();
  });

  it('declara que a troca de perspectiva não é autenticação', () => {
    renderAt('/');
    expect(screen.getByRole('navigation', { name: /não é login/i })).toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent(/não é login nem autorização/i);
  });

  it('mostra modo offline enquanto não há adaptador remoto', () => {
    renderAt('/ac/painel');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Modo offline: novas demandas não serão compartilhadas entre navegadores.',
    );
  });

  it('não tem paths duplicados', () => {
    const paths = APP_ROUTES.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
