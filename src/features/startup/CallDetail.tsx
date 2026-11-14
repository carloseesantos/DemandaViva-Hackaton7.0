import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { ResponseType, StartupResponse } from '../../domain/types';
import { REQUIREMENT_LABELS } from '../../data/catalog-enums';
import { Button } from '../../components/Button';
import { DemoSeal } from '../../components/DemoSeal';
import { StatusBadge } from '../../components/StatusBadge';
import { readSimulation, upsertResponse } from '../localState/simulationStore';

const RESPONSE_OPTIONS: ReadonlyArray<{ value: ResponseType; label: string }> = [
  { value: 'clarification', label: 'Pedir esclarecimento' },
  { value: 'existing_solution', label: 'Informar solução existente' },
  { value: 'adaptation', label: 'Propor adaptação' },
  { value: 'co_development', label: 'Codesenvolvimento' },
  { value: 'pilot', label: 'Piloto' },
  { value: 'decline', label: 'Declinar' },
];

const TEMPLATES: Record<ResponseType, Omit<StartupResponse, 'id' | 'callId' | 'startupId' | 'demoOnly'>> = {
  clarification: {
    responseType: 'clarification',
    coveredRequirements: [],
    questions: [
      'Para avaliar uma adaptação, precisamos conhecer a quantidade de itens, a frequência de atualização do estoque e a conectividade das lojas.',
    ],
    dependencies: [],
    risks: ['Sem dados suficientes para compromisso'],
    estimateCents: null,
    estimateDays: null,
  },
  existing_solution: {
    responseType: 'existing_solution',
    coveredRequirements: ['stock_lookup'],
    questions: [],
    dependencies: ['ERP X (se aplicável)'],
    risks: ['Pode não atender lojas sem ERP'],
    estimateCents: null,
    estimateDays: null,
  },
  adaptation: {
    responseType: 'adaptation',
    coveredRequirements: ['stock_lookup', 'whatsapp_workflow', 'no_erp_dependency'],
    questions: ['Qual volume de SKUs?'],
    dependencies: ['Atualização manual de estoque'],
    risks: ['Prazo e custo ainda não informados'],
    estimateCents: null,
    estimateDays: null,
  },
  co_development: {
    responseType: 'co_development',
    coveredRequirements: ['stock_lookup'],
    questions: ['Há disponibilidade para workshops fictícios?'],
    dependencies: ['Participação da AC (simulada)'],
    risks: ['Escopo aberto'],
    estimateCents: null,
    estimateDays: null,
  },
  pilot: {
    responseType: 'pilot',
    coveredRequirements: ['stock_lookup', 'mobile_access'],
    questions: [],
    dependencies: ['Duas unidades fictícias'],
    risks: ['Resultados não generalizáveis'],
    estimateCents: null,
    estimateDays: null,
  },
  decline: {
    responseType: 'decline',
    coveredRequirements: [],
    questions: [],
    dependencies: [],
    risks: [],
    estimateCents: null,
    estimateDays: null,
  },
};

export function CallDetail({ callId }: { callId: string }) {
  const sim = readSimulation();
  const call = useMemo(() => sim.calls.find((c) => c.id === callId) ?? null, [callId, sim.calls]);
  const [type, setType] = useState<ResponseType>('clarification');
  const [saved, setSaved] = useState(() => sim.responses.find((r) => r.callId === callId) ?? null);

  if (!call) {
    return (
      <section>
        <h1>Chamada não encontrada</h1>
        <Link to="/startup/chamadas">Voltar</Link>
      </section>
    );
  }

  const save = () => {
    const template = TEMPLATES[type];
    const response: StartupResponse = {
      id: `response:${call.id}:${type}`,
      callId: call.id,
      startupId: 'startup:pontelab',
      ...template,
      demoOnly: true,
    };
    upsertResponse(response);
    setSaved(response);
  };

  return (
    <section>
      <DemoSeal>Resposta fictícia registrada nesta sessão. Nenhuma startup foi contatada.</DemoSeal>
      <h1>{call.title}</h1>
      <StatusBadge tone="simulated">{call.mode}</StatusBadge>
      <p>
        Evidência de recorrência (sintética): {call.recurrenceEvidence.records} registros de{' '}
        {call.recurrenceEvidence.associations} associações — período {call.recurrenceEvidence.period}.
      </p>
      <h2>Requisitos mínimos da minuta</h2>
      <ul>
        {call.acceptanceRequirements.map((code) => (
          <li key={code}>{REQUIREMENT_LABELS[code]}</li>
        ))}
      </ul>
      <fieldset className="dv-fieldset">
        <legend>Tipo de resposta simulada</legend>
        {RESPONSE_OPTIONS.map((opt) => (
          <label key={opt.value} className="dv-choice">
            <input
              type="radio"
              name="responseType"
              checked={type === opt.value}
              onChange={() => setType(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </fieldset>
      <Button variant="primary" onClick={save}>
        Registrar resposta (simulação)
      </Button>
      {saved && (
        <div className="dv-surface" role="status">
          <h2>Resposta fictícia</h2>
          <p>Tipo: {saved.responseType}</p>
          <ul>
            {saved.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <p>
            Custo estimado:{' '}
            {saved.estimateCents === null ? 'Não informado' : `R$ ${(saved.estimateCents / 100).toFixed(2)}`}
          </p>
          <p>
            Prazo estimado:{' '}
            {saved.estimateDays === null ? 'Não informado' : `${saved.estimateDays} dias`}
          </p>
        </div>
      )}
      <p>
        <Link to="/startup/chamadas">Voltar às chamadas</Link>
      </p>
    </section>
  );
}
