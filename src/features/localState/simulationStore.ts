import type { InnovationCall, StartupResponse } from '../../domain/types';
import { SIMULATION_KEY } from './storageKeys';

export type SimulationState = {
  calls: InnovationCall[];
  responses: StartupResponse[];
  reviewedClusterIds: string[];
};

const EMPTY: SimulationState = { calls: [], responses: [], reviewedClusterIds: [] };

export function readSimulation(): SimulationState {
  try {
    const raw = localStorage.getItem(SIMULATION_KEY);
    if (!raw) return { ...EMPTY, calls: [], responses: [], reviewedClusterIds: [] };
    return JSON.parse(raw) as SimulationState;
  } catch {
    return { ...EMPTY, calls: [], responses: [], reviewedClusterIds: [] };
  }
}

export function writeSimulation(state: SimulationState): void {
  localStorage.setItem(SIMULATION_KEY, JSON.stringify(state));
}

export function clearSimulation(): void {
  localStorage.removeItem(SIMULATION_KEY);
}

export function upsertCall(call: InnovationCall): void {
  const state = readSimulation();
  writeSimulation({
    ...state,
    calls: [...state.calls.filter((c) => c.id !== call.id), call],
  });
}

export function upsertResponse(response: StartupResponse): void {
  const state = readSimulation();
  writeSimulation({
    ...state,
    responses: [...state.responses.filter((r) => r.id !== response.id), response],
  });
}

export function markClusterReviewed(clusterId: string): void {
  const state = readSimulation();
  if (state.reviewedClusterIds.includes(clusterId)) return;
  writeSimulation({
    ...state,
    reviewedClusterIds: [...state.reviewedClusterIds, clusterId],
  });
}
