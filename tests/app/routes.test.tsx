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
  return path
    .replace(':needId', 'e0a11000-0000-4000-8000-000000000001')
    .replace(':clusterId', encodeURIComponent('cluster:stock_confirmation_delay|manual|no_erp|whatsapp'))
    .replace(':callId', encodeURIComponent('call:demo'));
}

describe('rotas da SPA (AG-09)', () => {
  it.each(APP_ROUTES.map((route) => [route.id, route] as const))(
    'renderiza %s em acesso direto sem crash',
    (_id, route) => {
      renderAt(concretePath(route.path));
      expect(screen.getByRole('navigation', { name: /não é login/i })).toBeInTheDocument();
    },
  );

  it('home apresenta marca DEMANDA dominante', () => {
    renderAt('/');
    expect(document.querySelector('.dv-home__brand-demand')).toHaveTextContent('DEMANDA');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/próximo passo/i);
  });

  it('deep link de resultado seed B carrega sem score mágico hardcoded', async () => {
    renderAt('/lojista/resultado/e0a11000-0000-4000-8000-000000000001');
    expect(
      await screen.findByRole('heading', {
        name: /não identificamos uma solução elegível/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/Pontuação/i)).not.toBeInTheDocument();
  });

  it('deep link fixture A mostra score calculado', async () => {
    renderAt('/lojista/resultado/a0a11000-0000-4000-8000-000000000001');
    expect(
      await screen.findByRole('heading', {
        name: /solução elegível foi encontrada/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Pontuação 90 de 100/i)).toBeInTheDocument();
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
    expect(
      screen.getAllByRole('status').some((el) =>
        el.textContent?.includes(
          'Modo offline: novas demandas não serão compartilhadas entre navegadores.',
        ),
      ),
    ).toBe(true);
  });

  it('não tem paths duplicados', () => {
    const paths = APP_ROUTES.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
