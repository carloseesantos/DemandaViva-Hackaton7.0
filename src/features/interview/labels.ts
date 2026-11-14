import type {
  ChannelCode,
  FrequencyCode,
  PainCode,
  ProcessCode,
  RequirementCode,
  SegmentCode,
  SizeCode,
} from '../../domain/types';
import {
  ASSOCIATION_LABELS,
  BUDGET_LABELS,
  CHANNEL_LABELS,
  DATA_SHARING_LABELS,
  REQUIREMENT_LABELS,
  SEGMENT_LABELS,
  SIZE_LABELS,
} from '../../data/catalog-enums';

export { ASSOCIATION_LABELS, BUDGET_LABELS, CHANNEL_LABELS, DATA_SHARING_LABELS, REQUIREMENT_LABELS, SEGMENT_LABELS, SIZE_LABELS };

export const PAIN_OPTIONS: ReadonlyArray<{ value: PainCode; label: string }> = [
  { value: 'stock_confirmation_delay', label: 'Demora para confirmar estoque' },
  { value: 'sales_reconciliation', label: 'Dificuldade em conferir vendas' },
  { value: 'customer_follow_up', label: 'Perda de acompanhamento de clientes' },
];

export const PROCESS_OPTIONS: ReadonlyArray<{ value: ProcessCode; label: string }> = [
  { value: 'visual_check', label: 'Conferência visual' },
  { value: 'spreadsheet_check', label: 'Planilha' },
  { value: 'manual_message', label: 'Mensagens manuais' },
  { value: 'erp_lookup', label: 'Consulta ao ERP' },
  { value: 'other', label: 'Outro processo' },
];

export const FREQUENCY_OPTIONS: ReadonlyArray<{ value: FrequencyCode; label: string }> = [
  { value: 'daily', label: 'Todo dia' },
  { value: 'weekly', label: 'Toda semana' },
  { value: 'monthly', label: 'Todo mês' },
];

export const SEGMENT_OPTIONS: ReadonlyArray<{ value: SegmentCode; label: string }> = (
  Object.entries(SEGMENT_LABELS) as Array<[SegmentCode, string]>
).map(([value, label]) => ({ value, label }));

export const SIZE_OPTIONS: ReadonlyArray<{ value: SizeCode; label: string }> = (
  Object.entries(SIZE_LABELS) as Array<[SizeCode, string]>
).map(([value, label]) => ({ value, label }));

export const CHANNEL_OPTIONS: ReadonlyArray<{ value: ChannelCode; label: string }> = (
  Object.entries(CHANNEL_LABELS) as Array<[ChannelCode, string]>
).map(([value, label]) => ({ value, label }));

export const REQUIREMENT_OPTIONS: ReadonlyArray<{ value: RequirementCode; label: string }> = (
  Object.entries(REQUIREMENT_LABELS) as Array<[RequirementCode, string]>
).map(([value, label]) => ({ value, label }));

export const EPISODE_BY_PAIN: Record<PainCode, ReadonlyArray<{ key: string; label: string }>> = {
  stock_confirmation_delay: [
    { key: 'manual_check', label: 'Cliente pediu produto e a equipe precisou conferir manualmente' },
  ],
  sales_reconciliation: [
    { key: 'mismatch', label: 'Vendas e registros não coincidiram' },
  ],
  customer_follow_up: [
    { key: 'no_return', label: 'Um cliente ficou sem retorno' },
  ],
};

export const IMPACT_OPTIONS = [
  { key: 'delay', label: 'Demora no atendimento' },
  { key: 'rework', label: 'Retrabalho' },
  { key: 'lost_sale', label: 'Risco de perder venda' },
] as const;
