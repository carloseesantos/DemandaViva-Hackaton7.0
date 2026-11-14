import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="dv-surface dv-placeholder" data-route-id="not-found">
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe nesta demonstração.</p>
      <p>
        <Link to="/" className="dv-focusable">
          Voltar ao início
        </Link>
      </p>
    </section>
  );
}
