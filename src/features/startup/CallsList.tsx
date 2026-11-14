import { Link } from 'react-router';
import { DemoSeal } from '../../components/DemoSeal';
import { StatusBadge } from '../../components/StatusBadge';
import { readSimulation } from '../localState/simulationStore';

export function CallsList() {
  const { calls } = readSimulation();

  return (
    <section>
      <DemoSeal>Resposta fictícia — não enviada</DemoSeal>
      <h1>Chamadas simuladas</h1>
      <p>Resposta simulada — nenhuma startup recebeu este briefing.</p>
      {calls.length === 0 ? (
        <p>
          Nenhuma minuta de chamada nesta sessão.{' '}
          <Link to="/ac/painel">Prepare uma no painel da AC</Link>.
        </p>
      ) : (
        <ul className="dv-demand-list">
          {calls.map((call) => (
            <li key={call.id} className="dv-surface">
              <StatusBadge tone="simulated">{call.mode}</StatusBadge>
              <h2>{call.title}</h2>
              <p>
                {call.recurrenceEvidence.records} registros ·{' '}
                {call.recurrenceEvidence.associations} AC(s)
              </p>
              <Link to={`/startup/chamadas/${encodeURIComponent(call.id)}`}>Abrir</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
