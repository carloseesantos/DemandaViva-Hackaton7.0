import type { PersistenceState, QualifiedNeed, UUID } from '../../domain/types';
import { PERSISTENCE_KEY, SESSION_NEEDS_KEY } from './storageKeys';

export type SessionNeedRecord = {
  need: QualifiedNeed;
  persistence: PersistenceState;
};

function readAll(): SessionNeedRecord[] {
  try {
    const raw = localStorage.getItem(SESSION_NEEDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SessionNeedRecord[];
  } catch {
    return [];
  }
}

function writeAll(records: SessionNeedRecord[]): void {
  localStorage.setItem(SESSION_NEEDS_KEY, JSON.stringify(records));
}

export function listSessionNeeds(): SessionNeedRecord[] {
  return readAll();
}

export function getSessionNeed(id: string): SessionNeedRecord | null {
  return readAll().find((r) => r.need.id === id) ?? null;
}

export function upsertSessionNeed(record: SessionNeedRecord): void {
  const others = readAll().filter((r) => r.need.id !== record.need.id);
  writeAll([...others, record]);
  localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(record.persistence));
}

export function getPersistenceFor(id: UUID): PersistenceState | null {
  return getSessionNeed(id)?.persistence ?? null;
}

export function clearSessionNeeds(): void {
  localStorage.removeItem(SESSION_NEEDS_KEY);
  localStorage.removeItem(PERSISTENCE_KEY);
}
