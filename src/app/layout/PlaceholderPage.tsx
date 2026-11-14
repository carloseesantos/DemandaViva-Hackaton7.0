import { useParams } from 'react-router';
import type { AppRouteDefinition } from '../routes';

export function PlaceholderPage({ route }: { route: AppRouteDefinition }) {
  const params = useParams();
  const paramEntries = Object.entries(params).filter(([key]) => key !== '*');

  return (
    <section className="dv-surface dv-placeholder" data-route-id={route.id}>
      <h1>{route.title}</h1>
      <p>{route.summary}</p>
      {paramEntries.length > 0 && (
        <dl className="dv-placeholder__params">
          {paramEntries.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>
                <code>{value}</code>
              </dd>
            </div>
          ))}
        </dl>
      )}
      <p className="dv-placeholder__note">
        Rota provisória do scaffold (AG-02). Conteúdo a cargo de {route.owner}.
      </p>
    </section>
  );
}
