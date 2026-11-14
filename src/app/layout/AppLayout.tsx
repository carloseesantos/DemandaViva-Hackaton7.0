import { Link, NavLink, Outlet } from 'react-router';
import { useDependencies } from '../dependencies';
import { PERSPECTIVE_LINKS } from '../routes';

export function AppLayout() {
  const { remoteSharingEnabled } = useDependencies();

  return (
    <div className="dv-app dv-shell">
      <a className="dv-skip-link dv-focusable" href="#conteudo">
        Ir para o conteúdo
      </a>
      <header className="dv-header">
        <Link to="/" className="dv-header__brand dv-focusable" aria-label="DEMANDA VIVA — início">
          <img src="/brand/logo-horizontal.svg" alt="DEMANDA VIVA" width="208" height="38" />
        </Link>
        <nav aria-label="Perspectiva da demonstração (não é login)" className="dv-header__nav">
          <span className="dv-header__nav-label">Perspectiva (simulada):</span>
          <ul>
            {PERSPECTIVE_LINKS.map((link) => (
              <li key={link.perspective}>
                <NavLink to={link.to} className="dv-focusable">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div role="note" className="dv-banner dv-status--demo">
        Demonstração com dados fictícios. Trocar de perspectiva não é login nem autorização; aprovações de AC e
        respostas de startups são simuladas.
      </div>
      {!remoteSharingEnabled && (
        <div role="status" className="dv-banner dv-status--offline">
          Modo offline: novas demandas não serão compartilhadas entre navegadores.
        </div>
      )}

      <main id="conteudo" className="dv-main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="dv-footer">
        Hackathon Connect 7.0 — Desafio FACESP. Regras, pesos e catálogo são propostas da equipe, não critérios
        oficiais.
      </footer>
    </div>
  );
}
