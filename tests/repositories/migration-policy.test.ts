import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  join(import.meta.dirname, '..', '..', 'supabase', 'migrations', '20261114_001_demo_demands.sql'),
  'utf8',
);

describe('migration 001 — restrições documentadas', () => {
  it('habilita RLS e revoga PUBLIC/anon/authenticated antes dos GRANTs', () => {
    expect(migration).toMatch(/enable row level security/i);
    expect(migration).toMatch(/revoke all on table public\.demo_demands from PUBLIC, anon, authenticated/i);
  });

  it('concede INSERT de colunas explícitas e SELECT apenas a authenticated', () => {
    expect(migration).toMatch(/grant insert \([\s\S]*is_demo\)\s+on public\.demo_demands to authenticated/i);
    expect(migration).toMatch(/grant select on table public\.demo_demands to authenticated/i);
    expect(migration).not.toMatch(/grant\s+(update|delete)/i);
  });

  it('policies: insert/select próprios; sem UPDATE/DELETE', () => {
    expect(migration).toMatch(/demo_insert_own_synthetic/);
    expect(migration).toMatch(/demo_select_own/);
    expect(migration).toMatch(/owner_id = \(select auth\.uid\(\)\)/);
    expect(migration).not.toMatch(/for update/i);
    expect(migration).not.toMatch(/for delete/i);
  });

  it('exige is_demo=true e não inclui RPC cross-browser', () => {
    expect(migration).toMatch(/check \(is_demo = true\)/);
    expect(migration).not.toMatch(/create or replace function public\.list_demo_demands/i);
    expect(migration).toMatch(/G1S/);
  });

  it('indexes pertinentes existem', () => {
    expect(migration).toMatch(/demo_demands_created_at_idx/);
    expect(migration).toMatch(/demo_demands_cluster_idx/);
    expect(migration).toMatch(/demo_demands_owner_created_idx/);
  });
});
