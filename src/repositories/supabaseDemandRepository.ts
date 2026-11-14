import type { SupabaseClient } from '@supabase/supabase-js';
import type { DemandRepository, NewQualifiedNeed, QualifiedNeed, UUID } from '../domain/types';
import { DemandMappingError, RemoteUnavailableError } from './errors';
import { deserializeRow, serializeForInsert, type DemoDemandRow } from './mappers';
import {
  createPublishableSupabaseClient,
  type PublishableSupabaseConfig,
} from './supabaseClient';

const TABLE = 'demo_demands';
const SELECT_COLUMNS =
  'id, created_at, schema_version, source_code, association_code, segment_code, size_code, ' +
  'channel_code, pain_code, process_code, frequency_code, has_erp, erp_code, problem_summary, ' +
  'mandatory_requirements, optional_requirements, constraints, metric_code, baseline, target, ' +
  'demo_cluster_key, status, is_demo';

export interface SupabaseDemandRepositoryOptions {
  /** Injeta cliente (testes). Em produção usa createPublishableSupabaseClient. */
  client?: SupabaseClient;
  /**
   * Quando true (padrão), garante sessão Auth Anonymous antes de escrever/ler próprio.
   * Exige Anonymous Sign-Ins habilitado no projeto Supabase (passo manual).
   */
  ensureAnonymousSession?: boolean;
}

async function ensureAnonymous(client: SupabaseClient): Promise<void> {
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError) {
    throw new RemoteUnavailableError(`falha ao ler sessão: ${sessionError.message}`);
  }
  if (sessionData.session?.user) return;

  const { error } = await client.auth.signInAnonymously();
  if (error) {
    throw new RemoteUnavailableError(
      `Auth Anonymous indisponível (${error.message}). ` +
        'Habilite Anonymous Sign-Ins e mitigação antiabuso (Turnstile) no projeto, ou use modo local.',
    );
  }
}

function isDemoDemandRow(value: unknown): value is DemoDemandRow {
  return !!value && typeof value === 'object' && 'id' in value && 'created_at' in value;
}

function mapRows(rows: unknown[]): QualifiedNeed[] {
  const out: QualifiedNeed[] = [];
  for (const row of rows) {
    if (!isDemoDemandRow(row)) throw new DemandMappingError('row remota com formato inesperado');
    out.push(deserializeRow(row));
  }
  return out;
}

/**
 * Persistência remota de fichas qualificadas (DATA_MODEL §6–7).
 * SELECT limitado a linhas do owner (RLS demo_select_own) até G1S liberar RPC de projeção.
 * save() só resolve após INSERT … RETURNING confirmado e reidratado.
 */
export function createSupabaseDemandRepository(
  config: PublishableSupabaseConfig,
  options: SupabaseDemandRepositoryOptions = {},
): DemandRepository {
  const client = options.client ?? createPublishableSupabaseClient(config);
  const ensureSession = options.ensureAnonymousSession !== false;

  async function ready(): Promise<SupabaseClient> {
    if (ensureSession) await ensureAnonymous(client);
    return client;
  }

  async function getById(id: UUID): Promise<QualifiedNeed | null> {
    const sb = await ready();
    const { data, error } = await sb.from(TABLE).select(SELECT_COLUMNS).eq('id', id).maybeSingle();
    if (error) throw new RemoteUnavailableError(`SELECT get falhou: ${error.message}`);
    if (!data) return null;
    return deserializeRow(data as unknown as DemoDemandRow);
  }

  return {
    async save(need: NewQualifiedNeed): Promise<QualifiedNeed> {
      const payload = serializeForInsert(need);
      const sb = await ready();

      const { data, error } = await sb.from(TABLE).insert(payload).select(SELECT_COLUMNS).maybeSingle();

      if (error) {
        // Idempotência: conflito de UUID — só sucesso se a mesma ficha do mesmo owner existir.
        if (error.code === '23505') {
          const existing = await getById(need.id);
          if (existing) return existing;
          throw new RemoteUnavailableError(
            'conflito de UUID sem confirmação da ficha do mesmo owner; retry ou novo id',
          );
        }
        throw new RemoteUnavailableError(`INSERT rejeitado: ${error.message}`);
      }
      if (!data) {
        throw new RemoteUnavailableError(
          'INSERT sem retorno: verifique RLS SELECT próprio e GRANTs; não há confirmação remota',
        );
      }
      return deserializeRow(data as unknown as DemoDemandRow);
    },

    async list(): Promise<QualifiedNeed[]> {
      const sb = await ready();
      const pageSize = 100;
      const all: unknown[] = [];
      for (let from = 0; ; from += pageSize) {
        const to = from + pageSize - 1;
        const { data, error } = await sb
          .from(TABLE)
          .select(SELECT_COLUMNS)
          .order('created_at', { ascending: true })
          .order('id', { ascending: true })
          .range(from, to);
        if (error) throw new RemoteUnavailableError(`SELECT list falhou: ${error.message}`);
        const batch = data ?? [];
        all.push(...batch);
        if (batch.length < pageSize) break;
        // Sem RPC G1S, RLS já limita ao owner; teto operacional evita loop infinito.
        if (all.length >= 500) break;
      }
      return mapRows(all);
    },

    get(id: UUID): Promise<QualifiedNeed | null> {
      return getById(id);
    },
  };
}
