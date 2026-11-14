import { describe, expect, it, vi } from 'vitest';
import { SCHEMA_VERSION } from '../../src/domain/types';
import type { NewQualifiedNeed, UUID } from '../../src/domain/types';
import { PAIN_TEMPLATES } from '../../src/data/registries';
import { RemoteUnavailableError } from '../../src/repositories/errors';
import { createSupabaseDemandRepository } from '../../src/repositories/supabaseDemandRepository';

const id = 'e0a11000-0000-4000-8000-000000000005' as UUID;

function sampleNeed(): NewQualifiedNeed {
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
        id: `req:${id}:no_erp_dependency`,
        code: 'no_erp_dependency',
        kind: 'mandatory',
        priority: 1,
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
  };
}

function confirmedRow() {
  return {
    id,
    created_at: '2026-11-14T16:05:00.000Z',
    schema_version: 1,
    source_code: 'demo_session',
    association_code: 'ac_alfa',
    segment_code: 'stationery',
    size_code: 'micro',
    channel_code: 'whatsapp',
    pain_code: 'stock_confirmation_delay',
    process_code: 'spreadsheet_check',
    frequency_code: 'daily',
    has_erp: false,
    erp_code: null,
    problem_summary: PAIN_TEMPLATES.stock_confirmation_delay,
    mandatory_requirements: ['stock_lookup', 'no_erp_dependency'],
    optional_requirements: [],
    constraints: {
      budgetBand: 'low',
      dataSharing: 'restricted',
      mobileRequired: true,
      offlineRequired: false,
      trainingMaxHours: 2,
    },
    metric_code: 'confirmation_minutes',
    baseline: 7,
    target: 2,
    demo_cluster_key: 'stock_confirmation_delay|manual|no_erp|whatsapp',
    status: 'qualified',
    is_demo: true,
  };
}

type QueryResult = { data: unknown; error: { message: string; code?: string } | null };

function createMockClient(handlers: {
  insertResult?: QueryResult;
  listResult?: QueryResult;
  getResult?: QueryResult;
  sessionUser?: boolean;
}) {
  const maybeSingle = vi.fn(async () => handlers.insertResult ?? handlers.getResult ?? { data: null, error: null });
  const range = vi.fn(async () => handlers.listResult ?? { data: [], error: null });
  const order2 = vi.fn(() => ({ range }));
  const order1 = vi.fn(() => ({ order: order2 }));
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ maybeSingle, order: order1, eq }));
  const insert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ insert, select }));

  return {
    from,
    auth: {
      getSession: vi.fn(async () => ({
        data: { session: handlers.sessionUser === false ? null : { user: { id: 'owner-1' } } },
        error: null,
      })),
      signInAnonymously: vi.fn(async () => ({ data: {}, error: null })),
    },
    _spies: { from, insert, select, maybeSingle, range },
  };
}

describe('SupabaseDemandRepository (mock client)', () => {
  it('save() só resolve após RETURNING confirmado', async () => {
    const client = createMockClient({
      insertResult: { data: confirmedRow(), error: null },
      sessionUser: true,
    });
    const repo = createSupabaseDemandRepository(
      { url: 'https://exemplo-ficticio.supabase.co', publishableKey: 'sb_publishable_test' },
      { client: client as never, ensureAnonymousSession: true },
    );
    const saved = await repo.save(sampleNeed());
    expect(saved.id).toBe(id);
    expect(saved.origin).toBe('remote');
    expect(saved.createdAt).toBe('2026-11-14T16:05:00.000Z');
    expect(client._spies.insert).toHaveBeenCalled();
  });

  it('save() sem retorno não alega sincronização', async () => {
    const client = createMockClient({
      insertResult: { data: null, error: null },
      sessionUser: true,
    });
    const repo = createSupabaseDemandRepository(
      { url: 'https://exemplo-ficticio.supabase.co', publishableKey: 'sb_publishable_test' },
      { client: client as never },
    );
    await expect(repo.save(sampleNeed())).rejects.toBeInstanceOf(RemoteUnavailableError);
  });

  it('list() reidrata rows próprias', async () => {
    const client = createMockClient({
      listResult: { data: [confirmedRow()], error: null },
      sessionUser: true,
    });
    const repo = createSupabaseDemandRepository(
      { url: 'https://exemplo-ficticio.supabase.co', publishableKey: 'sb_publishable_test' },
      { client: client as never },
    );
    const list = await repo.list();
    expect(list).toHaveLength(1);
    expect(list[0]?.origin).toBe('remote');
  });

  it('falha de Auth Anonymous vira RemoteUnavailableError', async () => {
    const client = createMockClient({ sessionUser: false });
    client.auth.signInAnonymously = vi.fn(async () => ({
      data: {},
      error: { message: 'Anonymous provider is disabled' },
    })) as unknown as typeof client.auth.signInAnonymously;
    const repo = createSupabaseDemandRepository(
      { url: 'https://exemplo-ficticio.supabase.co', publishableKey: 'sb_publishable_test' },
      { client: client as never },
    );
    await expect(repo.save(sampleNeed())).rejects.toBeInstanceOf(RemoteUnavailableError);
  });
});
