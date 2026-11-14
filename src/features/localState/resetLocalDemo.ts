import { clearDraft, clearEphemeral } from './draftStore';
import { clearSessionNeeds } from './sessionNeedsStore';
import { clearSimulation } from './simulationStore';

/** Remove apenas estado local. Nunca apaga registros já sincronizados no Supabase. */
export function resetLocalDemo(): void {
  clearDraft();
  clearEphemeral();
  clearSessionNeeds();
  clearSimulation();
}
