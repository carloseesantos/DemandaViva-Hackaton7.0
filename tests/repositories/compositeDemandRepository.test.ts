import { describe, expect, it, vi } from 'vitest';
import { SCHEMA_VERSION } from '../../src/domain/types';
import type { DemandRepository, NewQualifiedNeed, QualifiedNeed, UUID } from '../../src/domain/types';
import { PAIN_TEMPLATES } from '../../src/data/registries';
import { seedDemands } from '../../src/data/seed-demands';
import { createCompositeDemandRepository } from '../../src/repositories/compositeDemandRepository';
import { RemoteUnavailableError, SeedRemoteIdCollisionError } from '../../src/repositories/errors';
import { createStaticSeedRepository } from '../../src/repositories/staticSeedRepository';
import { createUnavailableDemandRepository } from '../../src/repositories/unavailableDemandRepository';

const remoteId = 'e0a11000-0000-4000-8000-000000000005' as UUID;

function remoteNeed(id: UUID = remoteId): QualifiedNeed {
  return {
    id,
    schemaVersion: SCHEMA_VERSION,
    origin: 'remote',
    createdAt: '2026-11-14T16:00:00Z' as QualifiedNeed['createdAt'],
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
    requirements: seedDemands[0]!.requirements,
    constraints: seedDemands[0]!.constraints,
    metric: { code: 'confirmation_minutes', baseline: 7, target: 2 },
    demoClusterKey: 'stock_confirmation_delay|manual|no_erp|whatsapp',
  };
}

function fakeRemote(overrides: Partial<DemandRepository> = {}): DemandRepository {
  const stored = new Map<string, QualifiedNeed>();
  return {
    async list() {
      return [...stored.values()];
    },
    async get(id) {
      return stored.get(id) ?? null;
    },
    async save(need: NewQualifiedNeed) {
      const saved = remoteNeed(need.id);
      stored.set(saved.id, saved);
      return saved;
    },
    ...overrides,
  };
}

describe('CompositeDemandRepository', () => {
  it('mescla 4 seeds + 1 remoto sem duplicar (CT-06)', async () => {
    const remote = fakeRemote();
    await remote.save({ ...(remoteNeed() as NewQualifiedNeed), origin: 'remote' });
    const composite = createCompositeDemandRepository(createStaticSeedRepository(), remote);
    const list = await composite.list();
    expect(list).toHaveLength(5);
    expect(list.filter((n) => n.origin === 'seed')).toHaveLength(4);
    expect(list.filter((n) => n.origin === 'remote')).toHaveLength(1);
    expect(list.map((n) => n.id).at(-1)).toBe(remoteId);
  });

  it('seed vence colisão de UUID com remoto', async () => {
    const seedId = seedDemands[0]!.id;
    const onCollision = vi.fn();
    const remote = fakeRemote({
      async list() {
        return [remoteNeed(seedId)];
      },
    });
    const composite = createCompositeDemandRepository(createStaticSeedRepository(), remote, {
      onSeedCollision: onCollision,
    });
    const list = await composite.list();
    expect(list).toHaveLength(4);
    expect(list.find((n) => n.id === seedId)?.origin).toBe('seed');
    expect(onCollision).toHaveBeenCalledWith(expect.any(SeedRemoteIdCollisionError));
  });

  it('rede fora no list preserva seeds; save falha com RemoteUnavailableError (CT-11)', async () => {
    const composite = createCompositeDemandRepository(
      createStaticSeedRepository(),
      createUnavailableDemandRepository('rede simulada'),
    );
    const list = await composite.list();
    expect(list).toHaveLength(4);
    await expect(
      composite.save({ ...(remoteNeed() as NewQualifiedNeed), origin: 'remote' }),
    ).rejects.toBeInstanceOf(RemoteUnavailableError);
  });

  it('save() só resolve após remoto confirmar', async () => {
    const remote = fakeRemote();
    const saveSpy = vi.spyOn(remote, 'save');
    const composite = createCompositeDemandRepository(createStaticSeedRepository(), remote);
    const saved = await composite.save({ ...(remoteNeed() as NewQualifiedNeed), origin: 'remote' });
    expect(saveSpy).toHaveBeenCalledOnce();
    expect(saved.origin).toBe('remote');
    expect(saved.id).toBe(remoteId);
  });

  it('list degrada quando remoto lança erro', async () => {
    const remote = fakeRemote({
      list: () => Promise.reject(new RemoteUnavailableError('timeout')),
    });
    const composite = createCompositeDemandRepository(createStaticSeedRepository(), remote);
    await expect(composite.list()).resolves.toHaveLength(4);
  });
});
