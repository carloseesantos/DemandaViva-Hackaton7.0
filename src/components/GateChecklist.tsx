import type { GateResult } from '../domain/types';
import { GATE_LABELS } from '../data/catalog-enums';

export function GateChecklist({ gates }: { gates: GateResult[] }) {
  return (
    <ul className="dv-gate-list">
      {gates.map((gate) => (
        <li key={gate.code} className={`dv-gate-list__item dv-gate-list__item--${gate.status}`}>
          <strong>{GATE_LABELS[gate.code]}</strong>
          <span className="dv-gate-list__status">
            {gate.status === 'pass' ? 'Aprovado' : gate.status === 'fail' ? 'Reprovado' : 'Desconhecido'}
          </span>
          <p>{gate.reason}</p>
        </li>
      ))}
    </ul>
  );
}
