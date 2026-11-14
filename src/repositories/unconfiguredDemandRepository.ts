import type { DemandRepository } from '../domain/types';
import { RepositoryNotConfiguredError } from './errors';

// Placeholder do scaffold: rejeita toda operação para que nenhuma tela exiba contagem
// ou "salvo na nuvem" sem um adaptador real. Substituir em src/app/createDependencies.ts.
export function createUnconfiguredDemandRepository(): DemandRepository {
  return {
    save: () => Promise.reject(new RepositoryNotConfiguredError('save')),
    list: () => Promise.reject(new RepositoryNotConfiguredError('list')),
    get: () => Promise.reject(new RepositoryNotConfiguredError('get')),
  };
}
