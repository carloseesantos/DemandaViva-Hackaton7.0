import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Brief } from '../../domain/types';
import { useDependencies } from '../../app/dependencies';
import { REQUIREMENT_LABELS } from '../../data/catalog-enums';
import { solutions } from '../../data/solutions';
import { buildBrief, evaluateNeed } from '../../services';
import { DemoSeal } from '../../components/DemoSeal';
import { StatusBadge } from '../../components/StatusBadge';
import { resolveNeed } from '../result/resolveNeed';

export function BriefView({ needId }: { needId: string }) {
  const { demandRepository } = useDependencies();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const resolved = await resolveNeed(needId, demandRepository);
      if (resolved.kind !== 'qualified') {
        setError('Briefing só é gerado para necessidade qualificada.');
        return;
      }
      const evaluation = evaluateNeed(resolved.need);
      if (evaluation.status !== 'no_eligible_catalog_solution') {
        setError(
          'Esta ficha não está no estado B (sem match elegível). O briefing definitivo não se aplica.',
        );
        return;
      }
      setBrief(buildBrief(resolved.need, evaluation));
    })();
  }, [demandRepository, needId]);

  if (error) {
    return (
      <section>
        <h1>Briefing indisponível</h1>
        <p role="alert">{error}</p>
        <Link to={`/lojista/resultado/${needId}`}>Voltar ao resultado</Link>
      </section>
    );
  }

  if (!brief) return <p role="status">Preparando minuta local…</p>;

  return (
    <section className="dv-brief">
      <DemoSeal>Minuta de briefing — revisão da AC (simulada)</DemoSeal>
      <StatusBadge tone="demo">Briefing local — não publicado</StatusBadge>
      <h1>Briefing técnico</h1>
      <p>
        <code>{brief.id}</code>
      </p>
      <h2>Problema</h2>
      <p>{brief.problem}</p>
      <h2>Processo atual</h2>
      <p>{brief.currentProcess}</p>
      <h2>Resultado esperado</h2>
      <p>{brief.expectedOutcome}</p>
      <h2>Obrigatórios</h2>
      <ul>
        {brief.mandatory.map((code) => (
          <li key={code}>{REQUIREMENT_LABELS[code]}</li>
        ))}
      </ul>
      <h2>Desejáveis</h2>
      <ul>
        {brief.optional.length === 0 ? (
          <li>Nenhum</li>
        ) : (
          brief.optional.map((code) => <li key={code}>{REQUIREMENT_LABELS[code]}</li>)
        )}
      </ul>
      <h2>Lacunas do catálogo</h2>
      <ul>
        {brief.catalogGaps.map((gap) => {
          const name = solutions.find((s) => s.id === gap.solutionId)?.name ?? gap.solutionId;
          return (
            <li key={gap.solutionId}>
              {name}: gates {gap.gateCodes.join(', ')}
            </li>
          );
        })}
      </ul>
      <h2>Perguntas em aberto</h2>
      <ul>
        {brief.openQuestions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
      <p className="dv-muted">
        Autorização de compartilhamento: {brief.shareAuthorization}. Revisão: {brief.review.status} (
        {brief.review.mode}).
      </p>
      <div className="dv-actions">
        <Link to="/ac/painel">Explorar demandas semelhantes (simulação)</Link>
        <Link to={`/lojista/resultado/${needId}`}>Voltar ao resultado</Link>
      </div>
    </section>
  );
}
