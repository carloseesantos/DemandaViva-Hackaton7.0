import type { NeedDraft, UUID } from '../../domain/types';
import { DRAFT_KEY, EPHEMERAL_KEY } from './storageKeys';

export type InterviewEphemeral = {
  episodeKey?: string;
  impactKey?: string;
};

export function readDraft(): NeedDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as NeedDraft;
  } catch {
    return null;
  }
}

export function writeDraft(draft: NeedDraft): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

export function readEphemeral(): InterviewEphemeral {
  try {
    const raw = sessionStorage.getItem(EPHEMERAL_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as InterviewEphemeral;
  } catch {
    return {};
  }
}

export function writeEphemeral(value: InterviewEphemeral): void {
  sessionStorage.setItem(EPHEMERAL_KEY, JSON.stringify(value));
}

export function clearEphemeral(): void {
  sessionStorage.removeItem(EPHEMERAL_KEY);
}

export function createEmptyDraft(id?: UUID): NeedDraft {
  return {
    id: (id ?? crypto.randomUUID()) as UUID,
    schemaVersion: 1,
    status: 'draft',
    localOnly: true,
    isDemo: true,
    fields: {},
    missingFields: [],
  };
}
