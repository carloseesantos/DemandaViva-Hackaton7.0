import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { MatchEvaluation, PersistenceState, QualifiedNeed } from '../../domain/types';
import { useDependencies } from '../../app/dependencies';
import { CATALOG_DISCLOSURE, GATE_LABELS, REQUIREMENT_LABELS } from '../../data/catalog-enums';
import { evidenceForSolution, solutionDisplayDetails, solutions } from '../../data/solutions';
import { startups } from '../../data/startups';
import { evaluateNeed, buildBrief } from '../../services';
import { Button } from '../../components/Button';
import { DemoSeal } from '../../components/DemoSeal';
import { GateChecklist } from '../../components/GateChecklist';
import { PersistenceStatus } from '../../components/PersistenceStatus';
import { ScoreBreakdown } from '../../components/ScoreBreakdown';
import { StatusBadge } from '../../components/StatusBadge';
import { getSessionNeed } from '../localState/sessionNeedsStore';
import { persistQualifiedNeed } from './persistNeed';
import { resolveNeed } from './resolveNeed';

type ViewModel =
  | { status: 'loading' }
  | { status: 'missing'; message: string }
  | {
      status: 'draft_c';
      needId: string;
      missingFields: string[];
      evaluation: MatchEvaluation;
      persistence: PersistenceState;
    }
  | {
      status: 'ready';
      need: QualifiedNeed;
      evaluation: MatchEvaluation;
      persistence: PersistenceState;
    };

function topEligible(evaluation: MatchEvaluation) {
  if (evaluation.status === 'insufficient_data') return null;
  const id = evaluation.topSolutionId;
  if (!id) return null;
  const result = evaluation.results.find((r) => r.solutionId === id);
  if (!result || result.outcome !== 'eligible') return null;
  return result;
}

export function ResultView({ needId }: { needId: string }) {
  const { demandRepository, remoteSharingEnabled } = useDependencies();
  const [model, setModel] = useState<ViewModel>({ status: 'loading' });
  const [demoRequestOpen, setDemoRequestOpen] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const resolved = await resolveNeed(needId, demandRepository);
      if (cancelled) return;

      if (resolved.kind === 'missing') {
        setModel({ status: 'missing', message: 'Registro não encontrado nesta demonstração.' });
        return;
      }

      if (resolved.kind === 'draft') {
        setModel({
          status: 'draft_c',
          needId: resolved.need.id,
          missingFields: resolved.need.missingFields,
          evaluation: {
            status: 'insufficient_data',
            needId: resolved.need.id,
            missingInformation: resolved.need.missingFields,
            results: [],
          },
          persistence: { state: 'local_draft' },
        });
        return;
      }

      const evaluatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
      const evaluation = evaluateNeed(resolved.need, evaluatedAt);
      const session = getSessionNeed(resolved.need.id);
      let persistence = session?.persistence ?? ({ state: 'local_draft' } as PersistenceState);

      const shouldAttemptSave =
        resolved.need.origin === 'remote' &&
        persistence.state !== 'synced' &&
        persistence.state !== 'saving';

      if (shouldAttemptSave) {
        persistence = await persistQualifiedNeed(
          demandRepository,
          remoteSharingEnabled,
          resolved.need,
        );
        if (cancelled) return;
      }

      setModel({
        status: 'ready',
        need: getSessionNeed(resolved.need.id)?.need ?? resolved.need,
        evaluation,
        persistence,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [demandRepository, needId, remoteSharingEnabled, retryToken]);

  const eligible = useMemo(() => {
    if (model.status !== 'ready') return null;
    return topEligible(model.evaluation);
  }, [model]);

  if (model.status === 'loading') {
    return (
      <p role="status" className="dv-banner dv-status--processing">
        Verificando requisitos obrigatórios antes de calcular compatibilidade…
      </p>
    );
  }

  if (model.status === 'missing') {
    return (
      <section className="dv-surface">
        <h1>Resultado indisponível</h1>
        <p role="alert">{model.message}</p>
        <Link to="/lojista/diagnostico">Voltar ao diagnóstico</Link>
      </section>
    );
  }

  if (model.status === 'draft_c') {
    return (
      <section className="dv-result">
        <DemoSeal />
        <StatusBadge tone="insufficient">Dados insuficientes</StatusBadge>
        <h1>Ainda faltam informações para verificar compatibilidade</h1>
        <p>Sem score e sem gravação remota para rascunho incompleto.</p>
        <ul>
          {model.missingFields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
        <Link className="dv-btn dv-btn--primary dv-focusable" to="/lojista/diagnostico?passo=1">
          Completar diagnóstico
        </Link>
      </section>
    );
  }

  const { need, evaluation, persistence } = model;
  const solution = eligible
    ? solutions.find((s) => s.id === eligible.solutionId)
    : undefined;
  const startup = solution ? startups.find((s) => s.id === solution.startupId) : undefined;
  const details = solution ? solutionDisplayDetails[solution.id] : undefined;

  return (
    <section className="dv-result">
      <DemoSeal />
      <PersistenceStatus
        state={persistence}
        remoteSharingEnabled={remoteSharingEnabled}
        onRetry={() => setRetryToken((n) => n + 1)}
      />

      {evaluation.status === 'recommended' && eligible && solution && (
        <>
          <StatusBadge tone="recommended">Solução recomendada (catálogo de demonstração)</StatusBadge>
          <h1>Uma solução elegível foi encontrada no catálogo de demonstração</h1>
          <p className="dv-muted">
            Compatibilidade estimada pelo método proposto da equipe; não é probabilidade de sucesso e
            não representa certificação FACESP.
          </p>
          <p>
            <strong>{solution.name}</strong> — {startup?.displayName}. {CATALOG_DISCLOSURE}
          </p>
          {details && <p className="dv-muted">{details.simulationNotice}</p>}
          <GateChecklist gates={eligible.gates} />
          <ScoreBreakdown score={eligible.score} breakdown={eligible.breakdown} />
          <h2>Evidências simuladas</h2>
          <ul>
            {evidenceForSolution(solution.id).map((ev) => (
              <li key={ev.id}>
                [{ev.kind}] {ev.statement} ({ev.sourceMode})
              </li>
            ))}
          </ul>
          <p>
            Custo declarado:{' '}
            {solution.minimumMonthlyCostCents === null
              ? 'Não informado'
              : `R$ ${(solution.minimumMonthlyCostCents / 100).toFixed(2)}/mês (fictício)`}
          </p>
          <StatusBadge tone="simulated">Revisão da Associação (simulada)</StatusBadge>
          <div className="dv-actions">
            <Button variant="primary" onClick={() => setDemoRequestOpen(true)}>
              Solicitar demonstração (simulação)
            </Button>
            <Link to="/ac/painel">Ver painel da AC</Link>
          </div>
          {demoRequestOpen && (
            <div className="dv-surface" role="dialog" aria-modal="true" aria-labelledby="demo-sim">
              <h2 id="demo-sim">Pedido simulado</h2>
              <p>
                Este pedido não será enviado a nenhuma empresa. Em operação real, dependeria de
                autorização da AC e interesse do lojista.
              </p>
              <Button variant="secondary" onClick={() => setDemoRequestOpen(false)}>
                Fechar
              </Button>
            </div>
          )}
        </>
      )}

      {evaluation.status === 'conditional' && eligible && (
        <>
          <StatusBadge tone="conditional">Compatibilidade condicional</StatusBadge>
          <h1>Requer esclarecimentos — não é aprovação</h1>
          <GateChecklist gates={eligible.gates} />
          <ScoreBreakdown score={eligible.score} breakdown={eligible.breakdown} />
          <p className="dv-muted">A Associação deve revisar os pontos de atenção (simulação).</p>
        </>
      )}

      {evaluation.status === 'no_recommendation' && eligible && (
        <>
          <StatusBadge tone="conditional">Sem recomendação automática</StatusBadge>
          <h1>
            Existem soluções elegíveis no catálogo, mas nenhuma atingiu a faixa proposta de
            recomendação
          </h1>
          <GateChecklist gates={eligible.gates} />
          <ScoreBreakdown score={eligible.score} breakdown={eligible.breakdown} />
        </>
      )}

      {evaluation.status === 'no_eligible_catalog_solution' && (
        <>
          <StatusBadge tone="ineligible">Briefing técnico preparado</StatusBadge>
          <h1>Não identificamos uma solução elegível no catálogo consultado</h1>
          <p>
            considerando as restrições informadas. Isto não significa que não existam outras soluções
            no mercado.
          </p>
          {evaluation.results
            .filter(
              (r): r is Extract<(typeof evaluation.results)[number], { outcome: 'ineligible' }> =>
                r.outcome === 'ineligible' && r.solutionId === 'solution:estoqueponte-v1',
            )
            .map((r) => (
              <div key={r.solutionId} className="dv-surface">
                <h2>EstoquePonte — inelegível</h2>
                <p>
                  A solução examinada exige ERP X; esta loja opera sem ERP. Não mostramos score porque
                  ela é inelegível.
                </p>
                <ul>
                  {r.failedGateCodes.map((code) => (
                    <li key={code}>
                      {GATE_LABELS[code]}: {r.gates.find((g) => g.code === code)?.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          <div className="dv-actions">
            <Link className="dv-btn dv-btn--primary dv-focusable" to={`/briefing/${need.id}`}>
              Revisar briefing
            </Link>
            <Link to="/ac/painel">Ver demandas semelhantes na Associação</Link>
          </div>
          <span className="dv-visually-hidden">{JSON.stringify(buildBrief(need, evaluation).id)}</span>
        </>
      )}

      {evaluation.status === 'insufficient_data' && (
        <>
          <StatusBadge tone="insufficient">Dados insuficientes no catálogo</StatusBadge>
          <h1>Precisamos confirmar informações da solução antes de recomendá-la</h1>
          <ul>
            {evaluation.missingInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      <details className="dv-details">
        <summary>Versões e transparência</summary>
        <p>
          needId={need.id}; origin={need.origin}; catalog/rules no resultado do motor.
        </p>
        <p>
          Requisitos:{' '}
          {need.requirements
            .map((r) => `${REQUIREMENT_LABELS[r.code]} (${r.kind})`)
            .join('; ')}
        </p>
      </details>
    </section>
  );
}
