import { useEffect, useMemo } from 'react';
import { ASSOCIATION_LABELS, CHANNEL_LABELS, PAIN_LABELS } from '../../data/catalog-enums';
import { DemoSeal } from '../../components/DemoSeal';
import { readSimulation } from '../localState/simulationStore';
import { useMergedDemands } from '../ac/useMergedDemands';

function countBy<T extends string>(items: T[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, key) => {
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function RegionalPanel() {
  const merge = useMergedDemands();
  const sim = readSimulation();

  useEffect(() => {
    void merge.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const needs = merge.demands.map((d) => d.need);
    return {
      total: needs.length,
      byAc: countBy(needs.map((n) => n.associationCode)),
      byPain: countBy(needs.map((n) => n.painCode)),
      byChannel: countBy(needs.map((n) => n.channelCode)),
      byOrigin: countBy(needs.map((n) => n.origin)),
      calls: sim.calls.length,
      responses: sim.responses.length,
    };
  }, [merge.demands, sim.calls.length, sim.responses.length]);

  return (
    <section>
      <DemoSeal>
        Visão agregada demonstrativa — dados fictícios, não estatísticas de associados
      </DemoSeal>
      <h1>Visão regional / FACESP</h1>
      <p className="dv-muted">
        Indicadores calculados exclusivamente de registros fictícios desta demonstração. Acesso
        institucional real exigiria autenticação e políticas de compartilhamento.
      </p>
      {merge.remotePartial && (
        <p role="status" className="dv-banner dv-status--offline">
          Denominador: seeds locais
          {merge.sessionLocalCount > 0 ? ` + sessão (${merge.sessionLocalCount})` : ''}. Remotos não
          lidos.
        </p>
      )}
      <div className="dv-kpi">
        <div>
          <strong>{stats.total}</strong>
          <span>fichas qualificadas visíveis</span>
        </div>
        <div>
          <strong>{stats.calls}</strong>
          <span>chamadas simuladas</span>
        </div>
        <div>
          <strong>{stats.responses}</strong>
          <span>respostas simuladas</span>
        </div>
      </div>
      <h2>Por associação</h2>
      <ul>
        {Object.entries(stats.byAc).map(([code, n]) => (
          <li key={code}>
            {ASSOCIATION_LABELS[code as keyof typeof ASSOCIATION_LABELS] ?? code}: {n}
          </li>
        ))}
      </ul>
      <h2>Por dor</h2>
      <ul>
        {Object.entries(stats.byPain).map(([code, n]) => (
          <li key={code}>
            {PAIN_LABELS[code as keyof typeof PAIN_LABELS] ?? code}: {n}
          </li>
        ))}
      </ul>
      <h2>Por canal</h2>
      <ul>
        {Object.entries(stats.byChannel).map(([code, n]) => (
          <li key={code}>
            {CHANNEL_LABELS[code as keyof typeof CHANNEL_LABELS] ?? code}: {n}
          </li>
        ))}
      </ul>
      <h2>Por origem</h2>
      <ul>
        {Object.entries(stats.byOrigin).map(([code, n]) => (
          <li key={code}>
            {code}: {n}
          </li>
        ))}
      </ul>
    </section>
  );
}
