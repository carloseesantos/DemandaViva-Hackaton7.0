import { Link, isRouteErrorResponse, useRouteError } from 'react-router';

export function RouteErrorPage() {
  const error = useRouteError();
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Erro inesperado.';

  return (
    <main className="dv-app dv-main">
      <section className="dv-surface dv-placeholder" role="alert">
        <h1>Algo deu errado</h1>
        <p>{detail}</p>
        <p>
          <Link to="/" className="dv-focusable">
            Voltar ao início
          </Link>
        </p>
      </section>
    </main>
  );
}
