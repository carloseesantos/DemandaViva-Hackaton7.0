import { describe, expect, it } from 'vitest';
import { createDependencies } from '../../src/app/createDependencies';
import { RemoteUnavailableError } from '../../src/repositories/errors';
import type { NewQualifiedNeed, UUID } from '../../src/domain/types';

describe('createDependencies (AG-08)', () => {
  it('sem Supabase: lista seeds e remoteSharingEnabled=false', async () => {
    const deps = createDependencies({ supabase: null, issues: [] });
    expect(deps.remoteSharingEnabled).toBe(false);
    const list = await deps.demandRepository.list();
    expect(list).toHaveLength(4);
    expect(list.every((n) => n.origin === 'seed')).toBe(true);
    await expect(deps.demandRepository.save({} as NewQualifiedNeed)).rejects.toBeInstanceOf(
      RemoteUnavailableError,
    );
  });

  it('com config: ainda não habilita sharing cross-browser (G1S)', () => {
    const deps = createDependencies({
      supabase: {
        url: 'https://exemplo-ficticio.supabase.co',
        publishableKey: 'sb_publishable_exemploFicticio123',
      },
      issues: [],
    });
    expect(deps.remoteSharingEnabled).toBe(false);
    expect(deps.runtime.supabase).not.toBeNull();
  });

  it('usa Composite com seeds (não o placeholder que rejeita list)', async () => {
    const deps = createDependencies({ supabase: null, issues: [] });
    await expect(deps.demandRepository.list()).resolves.toHaveLength(4);
    const seed = await deps.demandRepository.get(
      'e0a11000-0000-4000-8000-000000000001' as UUID,
    );
    expect(seed?.origin).toBe('seed');
  });
});
