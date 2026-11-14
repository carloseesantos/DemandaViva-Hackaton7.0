import { describe, expect, it } from 'vitest';
import type { NewQualifiedNeed, UUID } from '../../src/domain/types';
import { seedDemands } from '../../src/data/seed-demands';
import { SeedReadOnlyError } from '../../src/repositories/errors';
import { createStaticSeedRepository } from '../../src/repositories/staticSeedRepository';

describe('StaticSeedRepository', () => {
  const repo = createStaticSeedRepository();

  it('list() devolve as 4 seeds ordenadas por createdAt, id', async () => {
    const list = await repo.list();
    expect(list).toHaveLength(4);
    expect(list.map((n) => n.id)).toEqual(seedDemands.map((n) => n.id));
    expect(list.every((n) => n.origin === 'seed')).toBe(true);
  });

  it('get() encontra seed por UUID', async () => {
    const id = 'e0a11000-0000-4000-8000-000000000002' as UUID;
    const need = await repo.get(id);
    expect(need?.id).toBe(id);
  });

  it('save() é read-only', async () => {
    await expect(repo.save({} as NewQualifiedNeed)).rejects.toBeInstanceOf(SeedReadOnlyError);
  });
});
