import { createUnconfiguredDemandRepository } from '../repositories/unconfiguredDemandRepository';
import type { AppDependencies } from './dependencies';
import type { RuntimeConfig } from './env';

// Composition root. AG-08 substitui o repositório pelo CompositeDemandRepository
// (seeds AG-06 + Supabase) e só então pode ativar remoteSharingEnabled.
export function createDependencies(runtime: RuntimeConfig): AppDependencies {
  return {
    demandRepository: createUnconfiguredDemandRepository(),
    runtime,
    remoteSharingEnabled: false,
  };
}
