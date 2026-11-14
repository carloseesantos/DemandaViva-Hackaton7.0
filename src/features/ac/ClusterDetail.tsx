import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { InnovationCall } from '../../domain/types';
import { REQUIREMENT_LABELS } from '../../data/catalog-enums';
import { suggestClusters } from '../../services';
import { Button } from '../../components/Button';
import { DemoSeal } from '../../components/DemoSeal';
import { StatusBadge } from '../../components/StatusBadge';
import { markClusterReviewed, readSimulation, upsertCall } from '../localState/simulationStore';
import { useMergedDemands } from './useMergedDemands';

export function ClusterDetail({ clusterId }: { clusterId: string }) {
  const navigate = useNavigate();
  const merge = useMergedDemands();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void merge.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cluster = useMemo(() => {
    const all = suggestClusters(merge.demands.map((d) => d.need));
    return all.find((c) => c.id === clusterId) ?? null;
  }, [clusterId, merge.demands]);

  const sim = readSimulation();
  const existingCall = sim.calls.find((c) => c.clusterId === clusterId);

  if (merge.loading && !cluster) {
    return <p role="status">Atualizando demandas de demonstração…</p>;
  }

  if (!cluster) {
    return (
      <section>
        <h1>Agrupamento não encontrado</h1>
        <Link to="/ac/painel">Voltar ao painel</Link>
      </section>
    );
  }

  const reviewed = readSimulation().reviewedClusterIds.includes(cluster.id) || Boolean(existingCall);

  const review = () => {
    markClusterReviewed(cluster.id);
    setMessage(
      cluster.blockingConflicts.length > 0
        ? 'Revisão simulada registrada. Há conflitos bloqueantes — a chamada, se preparada, permanece minuta demonstrativa (não é aprovação automática).'
        : 'Revisão simulada registrada nesta sessão. Nenhuma decisão institucional ocorreu.',
    );
  };

  const prepareCall = () => {
    if (!reviewed) {
      setMessage('Revise o agrupamento (simulação) antes de preparar a minuta de chamada.');
      return;
    }
    if (cluster.distinctRecordCount < 2) {
      setMessage('É preciso mais de um registro distinto para preparar a minuta.');
      return;
    }
    const acceptance = [
      ...new Set(
        merge.demands
          .filter((d) => cluster.needIds.includes(d.need.id))
          .flatMap((d) =>
            d.need.requirements.filter((r) => r.kind === 'mandatory').map((r) => r.code),
          ),
      ),
    ];
    const call: InnovationCall = {
      id: `call:${cluster.id}:v1`,
      clusterId: cluster.id,
      version: 1,
      title: `Oportunidade fictícia — ${cluster.painCode}`,
      needIds: cluster.needIds,
      acceptanceRequirements: acceptance,
      recurrenceEvidence: {
        records: cluster.distinctRecordCount,
        associations: cluster.associationCodes.length,
        period: 'demonstração',
      },
      mode: 'opened_simulated',
      review: { mode: 'simulated', status: 'reviewed_simulated', note: 'Minuta demonstrativa' },
      sharing: 'simulated',
    };
    upsertCall(call);
    setMessage('Minuta de chamada preparada nesta demonstração. Nenhuma chamada foi publicada.');
    navigate(`/startup/chamadas/${encodeURIComponent(call.id)}`);
  };

  return (
    <section className="dv-cluster">
      <DemoSeal>Minuta demonstrativa; não publicada</DemoSeal>
      <h1>Similaridade sugerida</h1>
      <p>
        <code>{cluster.signature}</code>
      </p>
      <StatusBadge tone="simulated">Agrupamento sugerido — aguarda revisão</StatusBadge>
      <p>
        {cluster.distinctRecordCount} registros · ACs: {cluster.associationCodes.join(', ')}
      </p>
      <h2>Variações</h2>
      <ul>
        {cluster.variations.length === 0 ? (
          <li>Sem variações relevantes além da assinatura.</li>
        ) : (
          cluster.variations.map((v) => <li key={v}>{v}</li>)
        )}
      </ul>
      <h2>Conflitos bloqueantes</h2>
      <ul>
        {cluster.blockingConflicts.length === 0 ? (
          <li>Nenhum conflito bloqueante detectado pelo serviço temporário.</li>
        ) : (
          cluster.blockingConflicts.map((c) => <li key={c}>{c}</li>)
        )}
      </ul>
      {message && (
        <p role="status" className="dv-banner dv-status--demo">
          {message}
        </p>
      )}
      <div className="dv-actions">
        <Button variant="secondary" onClick={review}>
          Revisar agrupamento (simulação)
        </Button>
        <Button variant="primary" onClick={prepareCall}>
          Preparar chamada (simulação)
        </Button>
        {existingCall && (
          <Link to={`/startup/chamadas/${encodeURIComponent(existingCall.id)}`}>
            Abrir chamada existente
          </Link>
        )}
      </div>
      <details>
        <summary>Requisitos observados</summary>
        <ul>
          {merge.demands
            .filter((d) => cluster.needIds.includes(d.need.id))
            .flatMap((d) => d.need.requirements.filter((r) => r.kind === 'mandatory'))
            .map((r) => (
              <li key={`${r.id}`}>
                {REQUIREMENT_LABELS[r.code]}
              </li>
            ))}
        </ul>
      </details>
      <p>
        <Link to="/ac/painel">Voltar ao painel</Link>
      </p>
    </section>
  );
}
