import { Link, useNavigate, useSearchParams } from 'react-router';
import { Button } from '../components/Button';
import { DemoSeal } from '../components/DemoSeal';
import { resetLocalDemo } from '../features/localState/resetLocalDemo';
import { PERSPECTIVE_LINKS } from '../app/routes';

export function HomePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const cenario = params.get('cenario');

  const start = () => {
    if (cenario === 'a') {
      navigate('/lojista/diagnostico'); // fixture A é aberta no diagnóstico
      return;
    }
    navigate('/lojista/diagnostico');
  };

  return (
    <section className="dv-home">
      <DemoSeal />
      <header className="dv-home__hero">
        <p className="dv-home__brand" aria-label="DEMANDA VIVA">
          <span className="dv-home__brand-demand">DEMANDA</span>{' '}
          <span className="dv-home__brand-viva">Viva</span>
        </p>
        <h1>Sua necessidade pode encontrar um próximo passo</h1>
        <p>
          Qualifique dores do pequeno varejo com filtros eliminatórios antes do score. Sem match,
          a demanda segue viva como briefing. Demonstração com dados exclusivamente fictícios.
        </p>
        <div className="dv-actions">
          <Button variant="primary" onClick={start}>
            Iniciar diagnóstico demonstrativo
          </Button>
          <Link className="dv-btn dv-btn--secondary dv-focusable" to="/ac/painel">
            Explorar a rede
          </Link>
        </div>
      </header>

      <section aria-labelledby="perspectives-title">
        <h2 id="perspectives-title">Ver como (simulação — não é login)</h2>
        <ul className="dv-perspective-grid">
          {PERSPECTIVE_LINKS.map((link) => (
            <li key={link.perspective}>
              <Link className="dv-surface dv-perspective-card dv-focusable" to={link.to}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="scenarios-title">
        <h2 id="scenarios-title">Cenários do apresentador</h2>
        <p className="dv-muted">
          `?cenario=a|b|c` apenas navega; não cria registros remotos ao selecionar.
        </p>
        <ul className="dv-actions">
          <li>
            <Link to="/lojista/diagnostico">B — nova demanda sem ERP (roteiro principal)</Link>
          </li>
          <li>
            <Link to="/?cenario=a">A — fixture com ERP X (abrir no diagnóstico)</Link>
          </li>
          <li>
            <Link to="/lojista/diagnostico?passo=5">C — dados incompletos</Link>
          </li>
        </ul>
      </section>

      <section>
        <h2>Reiniciar demonstração local</h2>
        <p className="dv-muted">
          Reiniciar remove apenas o estado local desta demonstração. Registros já sincronizados não
          serão excluídos.
        </p>
        <Button
          variant="critical"
          onClick={() => {
            if (
              window.confirm(
                'Reiniciar remove apenas o estado local desta demonstração. Registros já sincronizados não serão excluídos. Continuar?',
              )
            ) {
              resetLocalDemo();
              navigate(0);
            }
          }}
        >
          Reiniciar estado local
        </Button>
      </section>
    </section>
  );
}
