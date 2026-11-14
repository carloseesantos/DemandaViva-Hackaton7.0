import { describe, expect, it } from 'vitest';
import { SCHEMA_VERSION } from '../../src/domain/types';
import type { NewQualifiedNeed, UUID } from '../../src/domain/types';
import { PAIN_TEMPLATES } from '../../src/data/registries';
import { DemandValidationError } from '../../src/repositories/errors';
import { deserializeRow, serializeForInsert } from '../../src/repositories/mappers';
import type { DemoDemandRow } from '../../src/repositories/mappers';

const id = 'e0a11000-0000-4000-8000-000000000005' as UUID;

function sampleNeed(overrides: Partial<NewQualifiedNeed> = {}): NewQualifiedNeed {
  return {
    id,
    schemaVersion: SCHEMA_VERSION,
    origin: 'remote',
    status: 'qualified',
    isDemo: true,
    associationCode: 'ac_alfa',
    segmentCode: 'stationery',
    sizeCode: 'micro',
    channelCode: 'whatsapp',
    painCode: 'stock_confirmation_delay',
    processCode: 'spreadsheet_check',
    frequencyCode: 'daily',
    hasErp: false,
    erpCode: null,
    problemSummary: PAIN_TEMPLATES.stock_confirmation_delay,
    requirements: [
      {
        id: `req:${id}:stock_lookup`,
        code: 'stock_lookup',
        kind: 'mandatory',
        priority: 1,
        description: 'x',
        acceptanceCriterion: 'y',
        evidence: 'simulated',
      },
      {
        id: `req:${id}:whatsapp_workflow`,
        code: 'whatsapp_workflow',
        kind: 'mandatory',
        priority: 1,
        description: 'x',
        acceptanceCriterion: 'y',
        evidence: 'simulated',
      },
      {
        id: `req:${id}:no_erp_dependency`,
        code: 'no_erp_dependency',
        kind: 'mandatory',
        priority: 1,
        description: 'x',
        acceptanceCriterion: 'y',
        evidence: 'simulated',
      },
      {
        id: `req:${id}:mobile_access`,
        code: 'mobile_access',
        kind: 'mandatory',
        priority: 2,
        description: 'x',
        acceptanceCriterion: 'y',
        evidence: 'simulated',
      },
      {
        id: `req:${id}:short_training`,
        code: 'short_training',
        kind: 'optional',
        priority: 2,
        description: 'x',
        acceptanceCriterion: 'y',
        evidence: 'simulated',
      },
    ],
    constraints: {
      budgetBand: 'low',
      dataSharing: 'restricted',
      mobileRequired: true,
      offlineRequired: false,
      trainingMaxHours: 2,
    },
    metric: { code: 'confirmation_minutes', baseline: 7, target: 2 },
    ...overrides,
  };
}

describe('serializeForInsert / deserializeRow', () => {
  it('roundtrip preserva códigos e marca origin remote', () => {
    const payload = serializeForInsert(sampleNeed());
    expect(payload).toMatchObject({
      id,
      schema_version: 1,
      source_code: 'demo_session',
      is_demo: true,
      status: 'qualified',
      erp_code: null,
      mandatory_requirements: [
        'stock_lookup',
        'whatsapp_workflow',
        'no_erp_dependency',
        'mobile_access',
      ],
      optional_requirements: ['short_training'],
    });
    expect(payload).not.toHaveProperty('created_at');
    expect(payload).not.toHaveProperty('owner_id');
    expect(payload).not.toHaveProperty('demo_cluster_key');

    const row: DemoDemandRow = {
      ...payload,
      created_at: '2026-11-14T15:00:00.000Z',
      demo_cluster_key: 'stock_confirmation_delay|manual|no_erp|whatsapp',
      baseline: '7.00',
      target: '2.00',
    };
    const need = deserializeRow(row);
    expect(need.origin).toBe('remote');
    expect(need.createdAt).toBe('2026-11-14T15:00:00.000Z');
    expect(need.demoClusterKey).toBe('stock_confirmation_delay|manual|no_erp|whatsapp');
    expect(need.requirements.filter((r) => r.kind === 'mandatory').map((r) => r.code)).toEqual(
      payload.mandatory_requirements,
    );
  });

  it('rejeita texto livre / PII no problemSummary', () => {
    expect(() =>
      serializeForInsert(
        sampleNeed({
          problemSummary: 'Meu CPF 123.456.789-00 precisa de ajuda urgente',
        }),
      ),
    ).toThrow(DemandValidationError);
  });

  it('rejeita RequirementCode desconhecido na desserialização', () => {
    const payload = serializeForInsert(sampleNeed());
    const row: DemoDemandRow = {
      ...payload,
      created_at: '2026-11-14T15:00:00.000Z',
      demo_cluster_key: 'stock_confirmation_delay|manual|no_erp|whatsapp',
      mandatory_requirements: ['not_a_real_requirement'],
    };
    expect(() => deserializeRow(row)).toThrow(/desconhecido/);
  });
});
