import { createAppDemandRepository } from '../repositories/DemandRepository';
import type { AppDependencies } from './dependencies';
import type { RuntimeConfig } from './env';

// Composition root. AG-08: Composite (seeds AG-06 + remoto).
// remoteSharingEnabled permanece false até G1S liberar projeção cross-browser.
export function createDependencies(runtime: RuntimeConfig): AppDependencies {
  const { repository, remoteSharingEnabled } = createAppDemandRepository(runtime.supabase);
  return {
    demandRepository: repository,
    runtime,
    remoteSharingEnabled,
  };
}
