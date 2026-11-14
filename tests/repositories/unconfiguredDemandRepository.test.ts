import { describe, expect, it } from 'vitest';
import type { NewQualifiedNeed, UUID } from '../../src/domain/types';
import { RepositoryNotConfiguredError } from '../../src/repositories/errors';
import { createUnconfiguredDemandRepository } from '../../src/repositories/unconfiguredDemandRepository';

describe('repositório placeholder do scaffold', () => {
  const repository = createUnconfiguredDemandRepository();

  it('list() rejeita em vez de devolver contagem presumida', async () => {
    await expect(repository.list()).rejects.toBeInstanceOf(RepositoryNotConfiguredError);
  });

  it('get() rejeita', async () => {
    await expect(repository.get('e0a11000-0000-4000-8000-000000000001' as UUID)).rejects.toBeInstanceOf(
      RepositoryNotConfiguredError,
    );
  });

  it('save() rejeita, sem simular sincronização', async () => {
    await expect(repository.save({} as NewQualifiedNeed)).rejects.toBeInstanceOf(RepositoryNotConfiguredError);
  });
});
