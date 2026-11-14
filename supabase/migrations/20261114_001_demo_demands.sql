-- DEMANDA VIVA — public.demo_demands (schema v1)
-- Fonte: docs/DATA_MODEL.md §7 (AG-01) + revisão de segurança AG-08.
-- ATENÇÃO: arquivo versionado no repositório; NÃO aplicado automaticamente.
-- Aplicar manualmente no projeto Supabase de demo após deliberação G1S (Auth Anonymous +
-- antiabuso efetivo). Sem G1S, não publicar endpoint com escrita/leitura cross-browser.
-- Nunca usar service_role no browser. Sem UPDATE/DELETE para visitantes.

create extension if not exists pgcrypto;

create or replace function public.demo_valid_requirement_codes(p jsonb, allow_empty boolean)
returns boolean language plpgsql immutable set search_path = '' as $$
declare elem jsonb; code text; seen text[] := array[]::text[];
begin
  if p is null or jsonb_typeof(p) <> 'array' then return false; end if;
  if jsonb_array_length(p) > 8 or (not allow_empty and jsonb_array_length(p) = 0)
     or octet_length(p::text) > 512 then return false; end if;
  for elem in select value from jsonb_array_elements(p) as t(value) loop
    if jsonb_typeof(elem) <> 'string' then return false; end if;
    code := elem #>> '{}';
    if code not in ('stock_lookup','whatsapp_workflow','multi_store',
      'no_erp_dependency','mobile_access','manual_stock_update',
      'privacy_preserving','short_training') or code = any(seen) then return false; end if;
    seen := array_append(seen,code);
  end loop;
  return true;
end;
$$;

create or replace function public.demo_requirement_sets_disjoint(a jsonb, b jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare elem text;
begin
  if jsonb_typeof(a) <> 'array' or jsonb_typeof(b) <> 'array' then return false; end if;
  for elem in select value from jsonb_array_elements_text(a) as t(value) loop
    if b ? elem then return false; end if;
  end loop;
  return true;
end;
$$;

create or replace function public.demo_valid_constraints(p jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare keys_count integer;
begin
  if p is null or jsonb_typeof(p) <> 'object' or octet_length(p::text) > 300 then return false; end if;
  select count(*) into keys_count from jsonb_object_keys(p) as k;
  if keys_count <> 5 then return false; end if;
  return coalesce((p->>'budgetBand' in ('low','medium','high')
    and p->>'dataSharing' in ('none','restricted','allowed')
    and jsonb_typeof(p->'mobileRequired') = 'boolean'
    and jsonb_typeof(p->'offlineRequired') = 'boolean'
    and (p->>'trainingMaxHours') ~ '^[0-8]$'
    and p ?& array['budgetBand','dataSharing','mobileRequired',
                    'offlineRequired','trainingMaxHours']), false);
end;
$$;

create table if not exists public.demo_demands (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner_id uuid not null default auth.uid(),
  schema_version smallint not null default 1 check (schema_version = 1),
  source_code text not null default 'demo_session' check (source_code = 'demo_session'),
  association_code text not null check (association_code in ('ac_alfa','ac_beta')),
  segment_code text not null check (segment_code in
    ('stationery','fashion','housewares','gifts','grocery','other')),
  size_code text not null check (size_code in ('micro','small')),
  channel_code text not null check (channel_code in ('whatsapp','counter','ecommerce','mixed')),
  pain_code text not null check (pain_code in
    ('stock_confirmation_delay','sales_reconciliation','customer_follow_up')),
  process_code text not null check (process_code in
    ('visual_check','spreadsheet_check','manual_message','erp_lookup','other')),
  frequency_code text not null check (frequency_code in ('daily','weekly','monthly')),
  has_erp boolean not null,
  erp_code text null,
  problem_summary text not null,
  mandatory_requirements jsonb not null,
  optional_requirements jsonb not null default '[]'::jsonb,
  constraints jsonb not null,
  metric_code text not null check (metric_code in
    ('confirmation_minutes','hours_per_week','error_rate_pct')),
  baseline numeric(8,2) not null,
  target numeric(8,2) not null,
  demo_cluster_key text generated always as (
    pain_code || '|' ||
    case when process_code in ('visual_check','spreadsheet_check','manual_message')
         then 'manual' else 'digital' end || '|' ||
    case when has_erp then 'erp' else 'no_erp' end || '|' || channel_code
  ) stored,
  status text not null default 'qualified' check (status = 'qualified'),
  is_demo boolean not null default true check (is_demo = true),
  constraint demo_erp_context check (
    (not has_erp and erp_code is null and process_code <> 'erp_lookup')
    or (has_erp and erp_code = 'erp_x')),
  constraint demo_req_mandatory_valid check
    (public.demo_valid_requirement_codes(mandatory_requirements,false)),
  constraint demo_req_optional_valid check
    (public.demo_valid_requirement_codes(optional_requirements,true)),
  constraint demo_req_disjoint check
    (public.demo_requirement_sets_disjoint(mandatory_requirements,optional_requirements)),
  constraint demo_constraints_valid check (public.demo_valid_constraints(constraints)),
  constraint demo_metric_range check
    (baseline > 0 and baseline <= 10000 and target >= 0 and target < baseline),
  constraint demo_stock_metric check
    (pain_code <> 'stock_confirmation_delay' or metric_code = 'confirmation_minutes'),
  constraint demo_summary_template check (
    char_length(problem_summary) <= 160 and
    problem_summary = case pain_code
      when 'stock_confirmation_delay' then
        'A confirmação manual de estoque atrasa respostas a pedidos.'
      when 'sales_reconciliation' then
        'A conferência manual de vendas aumenta o tempo de fechamento.'
      when 'customer_follow_up' then
        'O acompanhamento manual de clientes atrasa o retorno de contatos.'
    end)
);

create index if not exists demo_demands_created_at_idx
  on public.demo_demands (created_at desc, id);
create index if not exists demo_demands_cluster_idx
  on public.demo_demands (demo_cluster_key, created_at desc);
create index if not exists demo_demands_owner_created_idx
  on public.demo_demands (owner_id, created_at desc);

alter table public.demo_demands enable row level security;
revoke all on table public.demo_demands from PUBLIC, anon, authenticated;

-- Sessão Auth (inclui Anonymous sign-in → role authenticated). Sem GRANT a anon.
grant insert (id, schema_version, source_code, association_code, segment_code,
  size_code, channel_code, pain_code, process_code, frequency_code, has_erp,
  erp_code, problem_summary, mandatory_requirements, optional_requirements,
  constraints, metric_code, baseline, target, status, is_demo)
  on public.demo_demands to authenticated;
grant select on table public.demo_demands to authenticated;
-- created_at e owner_id: DEFAULT de servidor; visitante NÃO pode sobrescrever via GRANT.
-- Sem UPDATE / DELETE / TRUNCATE / REFERENCES para visitantes.

create policy demo_insert_own_synthetic on public.demo_demands
  for insert to authenticated with check (
    auth.uid() is not null and owner_id = (select auth.uid())
    and is_demo = true and status = 'qualified'
  );
create policy demo_select_own on public.demo_demands
  for select to authenticated using (
    auth.uid() is not null and owner_id = (select auth.uid()) and is_demo = true
  );
-- Sem policy SELECT para anon; sem policy UPDATE ou DELETE.
-- Leitura cross-browser (projeção sintética) NÃO está nesta migration:
-- exige deliberação G1S + RPC SECURITY DEFINER com colunas explícitas (ver docs/AG08_SECURITY_G1S.md).
-- Sem G1S aprovado: não aplicar RPC; demo local + select próprio + aviso na UI.
