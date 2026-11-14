import type { ScoreComponent } from '../domain/types';
import { SCORE_LABELS } from '../data/catalog-enums';

export function ScoreBreakdown({
  score,
  breakdown,
}: {
  score: number;
  breakdown: ScoreComponent[];
}) {
  return (
    <section className="dv-score" aria-labelledby="score-heading">
      <h3 id="score-heading">Compatibilidade calculada</h3>
      <p className="dv-score__value" aria-label={`Pontuação ${score} de 100`}>
        <span className="dv-score__number">{score}</span>
        <span aria-hidden="true">/100</span>
      </p>
      <p className="dv-muted">
        Método, pesos e faixas propostos pela equipe. Não são critérios oficiais FACESP. Score só
        aparece após seis filtros aprovados.
      </p>
      <ul className="dv-score__list">
        {breakdown.map((item) => (
          <li key={item.criterion}>
            <span>{SCORE_LABELS[item.criterion]}</span>
            <span>
              peso {item.weight}% · nota {item.rating}/5 · {item.points} pts
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
