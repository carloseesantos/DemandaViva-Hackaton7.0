import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import type { NeedDraft, Requirement, RequirementCode } from '../../domain/types';
import { makeDemoRequirement, PAIN_TEMPLATES } from '../../data/registries';
import { demoScenarioA, demoScenarioC } from '../../data/scenarios/demo-scenarios';
import { Button } from '../../components/Button';
import { DemoSeal } from '../../components/DemoSeal';
import { StatusBadge } from '../../components/StatusBadge';
import {
  clearDraft,
  createEmptyDraft,
  readDraft,
  readEphemeral,
  writeDraft,
  writeEphemeral,
  type InterviewEphemeral,
} from '../localState/draftStore';
import { upsertSessionNeed } from '../localState/sessionNeedsStore';
import {
  ASSOCIATION_LABELS,
  BUDGET_LABELS,
  CHANNEL_OPTIONS,
  DATA_SHARING_LABELS,
  EPISODE_BY_PAIN,
  FREQUENCY_OPTIONS,
  IMPACT_OPTIONS,
  PAIN_OPTIONS,
  PROCESS_OPTIONS,
  REQUIREMENT_OPTIONS,
  SEGMENT_OPTIONS,
  SIZE_OPTIONS,
} from './labels';
import { prefillScenarioB, qualifyDraft } from './qualifyNeed';

const STEPS = [
  { id: 1, title: 'Contexto' },
  { id: 2, title: 'Problema e episódio' },
  { id: 3, title: 'Rotina e ferramentas' },
  { id: 4, title: 'Limites e requisitos' },
  { id: 5, title: 'Meta e revisão' },
] as const;

function Fieldset({
  legend,
  children,
  error,
  describedBy,
}: {
  legend: string;
  children: ReactNode;
  error?: string;
  describedBy?: string;
}) {
  const errorId = useId();
  return (
    <fieldset className="dv-fieldset" aria-describedby={[describedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined}>
      <legend>{legend}</legend>
      {children}
      {error && (
        <p id={errorId} className="dv-field-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function GuidedInterview() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const step = Math.min(5, Math.max(1, Number(params.get('passo') || 1)));
  const [draft, setDraft] = useState<NeedDraft>(() => readDraft() ?? createEmptyDraft());
  const [ephemeral, setEphemeral] = useState<InterviewEphemeral>(() => readEphemeral());
  const [showAll, setShowAll] = useState(false);
  const [mode, setMode] = useState<'interview' | 'review'>('interview');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    writeDraft(draft);
  }, [draft]);

  useEffect(() => {
    writeEphemeral(ephemeral);
  }, [ephemeral]);

  const patchFields = (patch: NeedDraft['fields']) => {
    setDraft((prev) => {
      const fields = { ...prev.fields, ...patch };
      if (fields.hasErp === false) fields.erpCode = null;
      if (fields.hasErp === false && fields.processCode === 'erp_lookup') {
        delete fields.processCode;
      }
      if (fields.painCode) fields.problemSummary = PAIN_TEMPLATES[fields.painCode];
      return { ...prev, fields, status: 'draft' };
    });
  };

  const setMandatory = (codes: RequirementCode[]) => {
    const optional = (draft.fields.requirements ?? []).filter(
      (r) => r.kind === 'optional' && !codes.includes(r.code),
    );
    const requirements: Requirement[] = [
      ...codes.map((code) => makeDemoRequirement(draft.id, code, 'mandatory')),
      ...optional,
    ];
    patchFields({ requirements });
  };

  const setOptional = (codes: RequirementCode[]) => {
    const mandatory = (draft.fields.requirements ?? []).filter(
      (r) => r.kind === 'mandatory' && !codes.includes(r.code),
    );
    const requirements: Requirement[] = [
      ...mandatory,
      ...codes.map((code) => makeDemoRequirement(draft.id, code, 'optional')),
    ];
    patchFields({ requirements });
  };

  const mandatoryCodes = useMemo(
    () =>
      (draft.fields.requirements ?? []).filter((r) => r.kind === 'mandatory').map((r) => r.code),
    [draft.fields.requirements],
  );
  const optionalCodes = useMemo(
    () =>
      (draft.fields.requirements ?? []).filter((r) => r.kind === 'optional').map((r) => r.code),
    [draft.fields.requirements],
  );

  const goStep = (next: number) => {
    setParams({ passo: String(next) }, { replace: false });
  };

  const applyScenarioB = () => {
    const next = prefillScenarioB(crypto.randomUUID() as NeedDraft['id']);
    setDraft(next);
    setEphemeral({ episodeKey: 'manual_check', impactKey: 'delay' });
    goStep(5);
    setMode('review');
  };

  const openScenarioA = () => {
    upsertSessionNeed({
      need: demoScenarioA,
      persistence: { state: 'local_draft' },
    });
    navigate(`/lojista/resultado/${demoScenarioA.id}`);
  };

  const openScenarioC = () => {
    writeDraft(demoScenarioC);
    setDraft(demoScenarioC);
    setMode('review');
    goStep(5);
  };

  const confirm = () => {
    const result = qualifyDraft(draft, draft.id);
    if (!result.ok) {
      setDraft(result.draft);
      writeDraft(result.draft);
      setErrors(result.messages);
      navigate(`/lojista/resultado/${result.draft.id}`);
      return;
    }
    setErrors([]);
    clearDraft();
    upsertSessionNeed({
      need: result.need,
      persistence: { state: 'local_draft' },
    });
    navigate(`/lojista/resultado/${result.need.id}`);
  };

  const summary = (
    <aside className="dv-interview__summary" aria-label="Resumo do rascunho local">
      <h2>Resumo local</h2>
      <StatusBadge tone="demo">Rascunho apenas neste navegador</StatusBadge>
      <dl>
        <div>
          <dt>AC</dt>
          <dd>
            {draft.fields.associationCode
              ? ASSOCIATION_LABELS[draft.fields.associationCode]
              : '—'}
          </dd>
        </div>
        <div>
          <dt>Dor</dt>
          <dd>{draft.fields.painCode ?? '—'}</dd>
        </div>
        <div>
          <dt>ERP</dt>
          <dd>
            {draft.fields.hasErp === undefined ? '—' : draft.fields.hasErp ? 'Sim (ERP X)' : 'Não'}
          </dd>
        </div>
        <div>
          <dt>Canal</dt>
          <dd>{draft.fields.channelCode ?? '—'}</dd>
        </div>
      </dl>
      {ephemeral.episodeKey && (
        <p className="dv-muted">
          Episódio ilustrativo (não enviado): {ephemeral.episodeKey}
        </p>
      )}
    </aside>
  );

  return (
    <div className="dv-interview">
      <DemoSeal />
      <header className="dv-page-header">
        <h1>Diagnóstico guiado</h1>
        <p>
          Entrevista por regras fixas (sem IA em tempo real). Dados 100% fictícios; nada é login.
        </p>
      </header>

      <div className="dv-presenter-tools" role="group" aria-label="Atalhos do apresentador">
        <Button variant="secondary" onClick={applyScenarioB}>
          Preencher com cenário fictício B
        </Button>
        <Button variant="tertiary" onClick={openScenarioA}>
          Abrir fixture A (ERP X)
        </Button>
        <Button variant="tertiary" onClick={openScenarioC}>
          Abrir cenário C incompleto
        </Button>
      </div>

      <div className="dv-interview__layout">
        <div className="dv-interview__main">
          <p className="dv-progress" aria-live="polite">
            Etapa {step} de 5 — {STEPS[step - 1]?.title}
          </p>
          <Button variant="tertiary" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Ocultar lista de perguntas' : 'Ver todas as perguntas'}
          </Button>

          {showAll && (
            <ol className="dv-question-index">
              <li>Associação Comercial de demonstração</li>
              <li>Tipo de comércio</li>
              <li>Porte</li>
              <li>Canal</li>
              <li>Situação / dor</li>
              <li>Episódio ilustrativo (efêmero)</li>
              <li>Processo atual</li>
              <li>Frequência</li>
              <li>Impacto ilustrativo (efêmero)</li>
              <li>ERP</li>
              <li>Requisitos obrigatórios</li>
              <li>Requisitos desejáveis</li>
              <li>Teto mensal</li>
              <li>Compartilhamento de dados</li>
              <li>Celular</li>
              <li>Offline</li>
              <li>Treinamento</li>
              <li>Indicador</li>
              <li>Baseline</li>
              <li>Meta</li>
              <li>Confirmação do resumo</li>
            </ol>
          )}

          {mode === 'interview' && step === 1 && (
            <>
              <Fieldset legend="Qual Associação Comercial acompanha este atendimento de demonstração?">
                {(Object.entries(ASSOCIATION_LABELS) as Array<[keyof typeof ASSOCIATION_LABELS, string]>).map(
                  ([value, label]) => (
                    <label key={value} className="dv-choice">
                      <input
                        type="radio"
                        name="association"
                        checked={draft.fields.associationCode === value}
                        onChange={() => patchFields({ associationCode: value })}
                      />
                      {label}
                    </label>
                  ),
                )}
              </Fieldset>
              <Fieldset legend="Em que tipo de comércio esta loja se encaixa?">
                {SEGMENT_OPTIONS.map((opt) => (
                  <label key={opt.value} className="dv-choice">
                    <input
                      type="radio"
                      name="segment"
                      checked={draft.fields.segmentCode === opt.value}
                      onChange={() => patchFields({ segmentCode: opt.value })}
                    />
                    {opt.label}
                  </label>
                ))}
              </Fieldset>
              <Fieldset legend="Qual o porte desta loja fictícia?">
                {SIZE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="dv-choice">
                    <input
                      type="radio"
                      name="size"
                      checked={draft.fields.sizeCode === opt.value}
                      onChange={() => patchFields({ sizeCode: opt.value })}
                    />
                    {opt.label}
                  </label>
                ))}
              </Fieldset>
              <Fieldset legend="Por qual canal a situação acontece principalmente?">
                {CHANNEL_OPTIONS.map((opt) => (
                  <label key={opt.value} className="dv-choice">
                    <input
                      type="radio"
                      name="channel"
                      checked={draft.fields.channelCode === opt.value}
                      onChange={() => patchFields({ channelCode: opt.value })}
                    />
                    {opt.label}
                  </label>
                ))}
              </Fieldset>
            </>
          )}

          {mode === 'interview' && step === 2 && (
            <>
              <Fieldset legend="Qual situação está dificultando a rotina da loja?">
                {PAIN_OPTIONS.map((opt) => (
                  <label key={opt.value} className="dv-choice">
                    <input
                      type="radio"
                      name="pain"
                      checked={draft.fields.painCode === opt.value}
                      onChange={() => patchFields({ painCode: opt.value })}
                    />
                    {opt.label}
                  </label>
                ))}
              </Fieldset>
              <Fieldset legend="No exemplo desta simulação, o que aconteceu da última vez?">
                <p className="dv-muted">Exemplo fictício para contextualizar — não será enviado.</p>
                {(draft.fields.painCode
                  ? EPISODE_BY_PAIN[draft.fields.painCode]
                  : [{ key: 'none', label: 'Escolha a situação acima primeiro' }]
                ).map((opt) => (
                  <label key={opt.key} className="dv-choice">
                    <input
                      type="radio"
                      name="episode"
                      disabled={!draft.fields.painCode}
                      checked={ephemeral.episodeKey === opt.key}
                      onChange={() => setEphemeral((e) => ({ ...e, episodeKey: opt.key }))}
                    />
                    {opt.label}
                  </label>
                ))}
              </Fieldset>
              <Fieldset legend="Qual é o principal impacto neste exemplo?">
                <p className="dv-muted">Contexto desta simulação — não será enviado.</p>
                {IMPACT_OPTIONS.map((opt) => (
                  <label key={opt.key} className="dv-choice">
                    <input
                      type="radio"
                      name="impact"
                      checked={ephemeral.impactKey === opt.key}
                      onChange={() => setEphemeral((e) => ({ ...e, impactKey: opt.key }))}
                    />
                    {opt.label}
                  </label>
                ))}
              </Fieldset>
            </>
          )}

          {mode === 'interview' && step === 3 && (
            <>
              <Fieldset legend="Como a equipe tenta resolver isso hoje?">
                {PROCESS_OPTIONS.map((opt) => (
                  <label key={opt.value} className="dv-choice">
                    <input
                      type="radio"
                      name="process"
                      checked={draft.fields.processCode === opt.value}
                      onChange={() => patchFields({ processCode: opt.value })}
                    />
                    {opt.label}
                  </label>
                ))}
              </Fieldset>
              <Fieldset legend="Com que frequência isso acontece neste cenário?">
                {FREQUENCY_OPTIONS.map((opt) => (
                  <label key={opt.value} className="dv-choice">
                    <input
                      type="radio"
                      name="frequency"
                      checked={draft.fields.frequencyCode === opt.value}
                      onChange={() => patchFields({ frequencyCode: opt.value })}
                    />
                    {opt.label}
                  </label>
                ))}
              </Fieldset>
              <Fieldset legend="A loja utiliza um ERP para controlar a operação?">
                <label className="dv-choice">
                  <input
                    type="radio"
                    name="hasErp"
                    checked={draft.fields.hasErp === true}
                    onChange={() => patchFields({ hasErp: true, erpCode: 'erp_x' })}
                  />
                  Sim — ERP X (fictício)
                </label>
                <label className="dv-choice">
                  <input
                    type="radio"
                    name="hasErp"
                    checked={draft.fields.hasErp === false}
                    onChange={() => patchFields({ hasErp: false, erpCode: null })}
                  />
                  Não
                </label>
              </Fieldset>
            </>
          )}

          {mode === 'interview' && step === 4 && (
            <>
              <Fieldset legend="O que uma solução precisa fazer obrigatoriamente para ajudar?">
                {REQUIREMENT_OPTIONS.map((opt) => (
                  <label key={opt.value} className="dv-choice">
                    <input
                      type="checkbox"
                      checked={mandatoryCodes.includes(opt.value)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...mandatoryCodes, opt.value]
                          : mandatoryCodes.filter((c) => c !== opt.value);
                        setMandatory(next);
                      }}
                    />
                    {opt.label}
                  </label>
                ))}
              </Fieldset>
              <Fieldset legend="Quais recursos seriam bons de ter, mas não são indispensáveis?">
                <label className="dv-choice">
                  <input
                    type="checkbox"
                    checked={optionalCodes.length === 0}
                    onChange={() => setOptional([])}
                  />
                  Nenhum
                </label>
                {REQUIREMENT_OPTIONS.filter((opt) => !mandatoryCodes.includes(opt.value)).map(
                  (opt) => (
                    <label key={opt.value} className="dv-choice">
                      <input
                        type="checkbox"
                        checked={optionalCodes.includes(opt.value)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...optionalCodes, opt.value]
                            : optionalCodes.filter((c) => c !== opt.value);
                          setOptional(next);
                        }}
                      />
                      {opt.label}
                    </label>
                  ),
                )}
              </Fieldset>
              <Fieldset legend="Qual seria o teto mensal de gasto para este cenário fictício?">
                {(Object.entries(BUDGET_LABELS) as Array<[keyof typeof BUDGET_LABELS, string]>).map(
                  ([value, label]) => (
                    <label key={value} className="dv-choice">
                      <input
                        type="radio"
                        name="budget"
                        checked={draft.fields.constraints?.budgetBand === value}
                        onChange={() =>
                          patchFields({
                            constraints: {
                              budgetBand: value,
                              dataSharing: draft.fields.constraints?.dataSharing ?? 'restricted',
                              mobileRequired: draft.fields.constraints?.mobileRequired ?? false,
                              offlineRequired: draft.fields.constraints?.offlineRequired ?? false,
                              trainingMaxHours: draft.fields.constraints?.trainingMaxHours ?? 2,
                            },
                          })
                        }
                      />
                      {label}
                    </label>
                  ),
                )}
              </Fieldset>
              <Fieldset legend="Quanto a loja pode compartilhar com uma solução externa?">
                {(
                  Object.entries(DATA_SHARING_LABELS) as Array<[keyof typeof DATA_SHARING_LABELS, string]>
                ).map(([value, label]) => (
                  <label key={value} className="dv-choice">
                    <input
                      type="radio"
                      name="sharing"
                      checked={draft.fields.constraints?.dataSharing === value}
                      onChange={() =>
                        patchFields({
                          constraints: {
                            budgetBand: draft.fields.constraints?.budgetBand ?? 'low',
                            dataSharing: value,
                            mobileRequired: draft.fields.constraints?.mobileRequired ?? false,
                            offlineRequired: draft.fields.constraints?.offlineRequired ?? false,
                            trainingMaxHours: draft.fields.constraints?.trainingMaxHours ?? 2,
                          },
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </Fieldset>
              <Fieldset legend="A solução precisa funcionar em celular?">
                <label className="dv-choice">
                  <input
                    type="radio"
                    name="mobile"
                    checked={draft.fields.constraints?.mobileRequired === true}
                    onChange={() =>
                      patchFields({
                        constraints: {
                          budgetBand: draft.fields.constraints?.budgetBand ?? 'low',
                          dataSharing: draft.fields.constraints?.dataSharing ?? 'restricted',
                          mobileRequired: true,
                          offlineRequired: draft.fields.constraints?.offlineRequired ?? false,
                          trainingMaxHours: draft.fields.constraints?.trainingMaxHours ?? 2,
                        },
                      })
                    }
                  />
                  Sim
                </label>
                <label className="dv-choice">
                  <input
                    type="radio"
                    name="mobile"
                    checked={draft.fields.constraints?.mobileRequired === false}
                    onChange={() =>
                      patchFields({
                        constraints: {
                          budgetBand: draft.fields.constraints?.budgetBand ?? 'low',
                          dataSharing: draft.fields.constraints?.dataSharing ?? 'restricted',
                          mobileRequired: false,
                          offlineRequired: draft.fields.constraints?.offlineRequired ?? false,
                          trainingMaxHours: draft.fields.constraints?.trainingMaxHours ?? 2,
                        },
                      })
                    }
                  />
                  Não
                </label>
              </Fieldset>
              <Fieldset legend="Ela precisa funcionar sem internet?">
                <label className="dv-choice">
                  <input
                    type="radio"
                    name="offline"
                    checked={draft.fields.constraints?.offlineRequired === true}
                    onChange={() =>
                      patchFields({
                        constraints: {
                          budgetBand: draft.fields.constraints?.budgetBand ?? 'low',
                          dataSharing: draft.fields.constraints?.dataSharing ?? 'restricted',
                          mobileRequired: draft.fields.constraints?.mobileRequired ?? false,
                          offlineRequired: true,
                          trainingMaxHours: draft.fields.constraints?.trainingMaxHours ?? 2,
                        },
                      })
                    }
                  />
                  Sim
                </label>
                <label className="dv-choice">
                  <input
                    type="radio"
                    name="offline"
                    checked={draft.fields.constraints?.offlineRequired === false}
                    onChange={() =>
                      patchFields({
                        constraints: {
                          budgetBand: draft.fields.constraints?.budgetBand ?? 'low',
                          dataSharing: draft.fields.constraints?.dataSharing ?? 'restricted',
                          mobileRequired: draft.fields.constraints?.mobileRequired ?? false,
                          offlineRequired: false,
                          trainingMaxHours: draft.fields.constraints?.trainingMaxHours ?? 2,
                        },
                      })
                    }
                  />
                  Não
                </label>
              </Fieldset>
              <label className="dv-field">
                Qual o máximo de horas de treinamento aceitável neste exemplo?
                <select
                  className="dv-focusable"
                  value={draft.fields.constraints?.trainingMaxHours ?? ''}
                  onChange={(e) =>
                    patchFields({
                      constraints: {
                        budgetBand: draft.fields.constraints?.budgetBand ?? 'low',
                        dataSharing: draft.fields.constraints?.dataSharing ?? 'restricted',
                        mobileRequired: draft.fields.constraints?.mobileRequired ?? false,
                        offlineRequired: draft.fields.constraints?.offlineRequired ?? false,
                        trainingMaxHours: Number(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                    <option key={h} value={h}>
                      {h} hora{h === 1 ? '' : 's'}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          {mode === 'interview' && step === 5 && (
            <>
              <Fieldset legend="Qual resultado você gostaria de melhorar?">
                <label className="dv-choice">
                  <input
                    type="radio"
                    name="metric"
                    checked={draft.fields.metric?.code === 'confirmation_minutes'}
                    onChange={() =>
                      patchFields({
                        metric: {
                          code: 'confirmation_minutes',
                          baseline: draft.fields.metric?.baseline ?? 7,
                          target: draft.fields.metric?.target ?? 2,
                        },
                      })
                    }
                  />
                  Minutos para confirmar estoque
                </label>
                <label className="dv-choice">
                  <input
                    type="radio"
                    name="metric"
                    checked={draft.fields.metric?.code === 'hours_per_week'}
                    onChange={() =>
                      patchFields({
                        metric: {
                          code: 'hours_per_week',
                          baseline: draft.fields.metric?.baseline ?? 10,
                          target: draft.fields.metric?.target ?? 4,
                        },
                      })
                    }
                  />
                  Horas gastas por semana
                </label>
                <label className="dv-choice">
                  <input
                    type="radio"
                    name="metric"
                    checked={draft.fields.metric?.code === 'error_rate_pct'}
                    onChange={() =>
                      patchFields({
                        metric: {
                          code: 'error_rate_pct',
                          baseline: draft.fields.metric?.baseline ?? 15,
                          target: draft.fields.metric?.target ?? 5,
                        },
                      })
                    }
                  />
                  Percentual de erros
                </label>
              </Fieldset>
              <label className="dv-field">
                Hoje, qual é o valor desse indicador no cenário?
                <input
                  className="dv-focusable"
                  type="number"
                  min={0}
                  max={10000}
                  value={draft.fields.metric?.baseline ?? ''}
                  onChange={(e) =>
                    patchFields({
                      metric: {
                        code: draft.fields.metric?.code ?? 'confirmation_minutes',
                        baseline: Number(e.target.value),
                        target: draft.fields.metric?.target ?? 0,
                      },
                    })
                  }
                />
              </label>
              <label className="dv-field">
                Qual valor seria uma melhora relevante?
                <input
                  className="dv-focusable"
                  type="number"
                  min={0}
                  max={10000}
                  value={draft.fields.metric?.target ?? ''}
                  onChange={(e) =>
                    patchFields({
                      metric: {
                        code: draft.fields.metric?.code ?? 'confirmation_minutes',
                        baseline: draft.fields.metric?.baseline ?? 0,
                        target: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <Button variant="secondary" onClick={() => setMode('review')}>
                Revisar diagnóstico
              </Button>
            </>
          )}

          {mode === 'review' && (
            <section className="dv-review dv-surface" aria-labelledby="review-title">
              <h2 id="review-title">Confirmar diagnóstico demonstrativo</h2>
              <p className="dv-muted">
                Declarações do cenário fictício; não verificadas no mercado.
              </p>
              <div className="dv-review__grid">
                <div>
                  <h3>O que acontece</h3>
                  <p>{draft.fields.problemSummary ?? '—'}</p>
                </div>
                <div>
                  <h3>Como funciona hoje</h3>
                  <p>
                    Processo {draft.fields.processCode ?? '—'}; frequência{' '}
                    {draft.fields.frequencyCode ?? '—'}; ERP{' '}
                    {draft.fields.hasErp === undefined
                      ? '—'
                      : draft.fields.hasErp
                        ? draft.fields.erpCode
                        : 'não'}
                    .
                  </p>
                </div>
                <div>
                  <h3>Limites inegociáveis</h3>
                  <p>
                    Orçamento {draft.fields.constraints?.budgetBand ?? '—'}; dados{' '}
                    {draft.fields.constraints?.dataSharing ?? '—'}; mobile{' '}
                    {String(draft.fields.constraints?.mobileRequired ?? '—')}; offline{' '}
                    {String(draft.fields.constraints?.offlineRequired ?? '—')}.
                  </p>
                </div>
                <div>
                  <h3>Como mediremos</h3>
                  <p>
                    {draft.fields.metric
                      ? `${draft.fields.metric.code}: ${draft.fields.metric.baseline} → ${draft.fields.metric.target}`
                      : '—'}
                  </p>
                </div>
              </div>
              {errors.length > 0 && (
                <ul className="dv-field-error" role="alert">
                  {errors.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              )}
              <div className="dv-actions">
                <Button variant="secondary" onClick={() => setMode('interview')}>
                  Corrigir
                </Button>
                <Button variant="primary" onClick={confirm}>
                  Confirmar diagnóstico e comparar
                </Button>
              </div>
            </section>
          )}

          {mode === 'interview' && (
            <div className="dv-actions">
              <Button variant="secondary" disabled={step <= 1} onClick={() => goStep(step - 1)}>
                Voltar
              </Button>
              {step < 5 ? (
                <Button variant="primary" onClick={() => goStep(step + 1)}>
                  Próximo
                </Button>
              ) : (
                <Button variant="primary" onClick={() => setMode('review')}>
                  Ir para revisão
                </Button>
              )}
            </div>
          )}

          <p className="dv-muted">
            <Link to="/">Voltar ao início</Link>
          </p>
        </div>
        {summary}
      </div>
    </div>
  );
}
