import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { AssociationCode } from '../../domain/types';
import { ASSOCIATION_LABELS, PAIN_LABELS, SEGMENT_LABELS } from '../../data/catalog-enums';
import { seedDemoNarrative } from '../../data/seed-demands';
import { suggestClusters } from '../../services';
import { Button } from '../../components/Button';
import { DemoSeal } from '../../components/DemoSeal';
import { StatusBadge } from '../../components/StatusBadge';
import { useMergedDemands } from './useMergedDemands';

export function AcPanel() {
  const merge = useMergedDemands();
  const [filter, setFilter] = useState<AssociationCode | 'all'>('all');

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void merge.refresh();
    }, 0);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh once on mount
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return merge.demands;
    return merge.demands.filter((d) => d.need.associationCode === filter);
  }, [filter, merge.demands]);

  const clusters = useMemo(
    () => suggestClusters(filtered.map((d) => d.need)),
    [filtered],
  );

  return (
    <section className="dv-ac">
      <DemoSeal>
        Visão simulada da Associação Comercial — não representa acesso institucional
      </DemoSeal>
      <header className="dv-page-header">
        <h1>Painel da Associação Comercial</h1>
        <p>Revisão e abertura de chamadas simuladas — sem autorização institucional real.</p>
      </header>

      <div className="dv-kpi" role="group" aria-label="Indicadores calculados desta sessão">
        <div>
          <strong>{merge.totalDistinct}</strong>
          <span>registros distintos</span>
        </div>
        <div>
          <strong>{merge.seedCount}</strong>
          <span>seeds locais</span>
        </div>
        <div>
          <strong>{merge.remoteCount}</strong>
          <span>remotos lidos</span>
        </div>
        <div>
          <strong>{new Set(filtered.map((d) => d.need.associationCode)).size}</strong>
          <span>ACs no filtro</span>
        </div>
        <div>
          <strong>{clusters.length}</strong>
          <span>clusters candidatos</span>
        </div>
      </div>

      {merge.remotePartial && (
        <div role="status" className="dv-banner dv-status--offline">
          Contagem parcial — somente seeds
          {merge.sessionLocalCount > 0
            ? ` + ${merge.sessionLocalCount} da sessão local (não sincronizada)`
            : ''}
          . {merge.remoteError}
        </div>
      )}

      <div className="dv-actions">
        <Button
          variant="secondary"
          onClick={() => void merge.refresh()}
          disabled={merge.loading}
          aria-busy={merge.loading}
        >
          {merge.loading ? 'Atualizando demandas de demonstração…' : 'Atualizar demandas'}
        </Button>
        <label className="dv-field">
          Filtrar AC
          <select
            className="dv-focusable"
            value={filter}
            onChange={(e) => setFilter(e.target.value as AssociationCode | 'all')}
          >
            <option value="all">Todas (fictícias)</option>
            <option value="ac_alfa">{ASSOCIATION_LABELS.ac_alfa}</option>
            <option value="ac_beta">{ASSOCIATION_LABELS.ac_beta}</option>
          </select>
        </label>
      </div>

      <h2>Demandas</h2>
      <ul className="dv-demand-list">
        {filtered.map(({ need, source }) => {
          const narrative = seedDemoNarrative[need.id];
          return (
            <li key={need.id} className="dv-surface">
              <div className="dv-demand-list__head">
                <StatusBadge
                  tone={source === 'seed' ? 'demo' : source === 'remote' ? 'recommended' : 'offline'}
                >
                  {source === 'seed'
                    ? 'Seed local'
                    : source === 'remote'
                      ? 'Sincronizada'
                      : 'Sessão local — não sincronizada'}
                </StatusBadge>
                <code>{need.id}</code>
              </div>
              <p>
                <strong>{ASSOCIATION_LABELS[need.associationCode]}</strong> ·{' '}
                {SEGMENT_LABELS[need.segmentCode]} · {PAIN_LABELS[need.painCode]}
              </p>
              <p>{need.problemSummary}</p>
              {narrative && (
                <p className="dv-muted">
                  {narrative.storeCode}: {narrative.context} — {narrative.bottleneck}
                </p>
              )}
              <Link to={`/lojista/resultado/${need.id}`}>Ver resultado</Link>
            </li>
          );
        })}
      </ul>

      <h2>Agrupamentos sugeridos</h2>
      <p className="dv-muted">
        Encontramos relatos possivelmente semelhantes. A revisão da Associação ainda é necessária
        (simulação).
      </p>
      <ul className="dv-cluster-list">
        {clusters.map((cluster) => (
          <li key={cluster.id} className="dv-surface">
            <h3>{cluster.signature}</h3>
            <p>
              {cluster.distinctRecordCount} registros distintos · {cluster.associationCodes.length}{' '}
              AC(s)
            </p>
            {cluster.variations.length > 0 && (
              <p>Variações: {cluster.variations.join('; ')}</p>
            )}
            {cluster.blockingConflicts.length > 0 && (
              <p className="dv-field-error">
                Conflitos bloqueantes: {cluster.blockingConflicts.join('; ')}
              </p>
            )}
            <Link to={`/ac/clusters/${encodeURIComponent(cluster.id)}`}>
              Revisar agrupamento (simulação)
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
