export interface SupabasePublicConfig {
  url: string;
  publishableKey: string;
}

export interface RuntimeConfig {
  /** `null` = modo local: catálogo e seeds continuam; nada é compartilhado entre navegadores. */
  supabase: SupabasePublicConfig | null;
  /** Problemas de configuração exibíveis em console/diagnóstico; nunca contêm o valor da chave. */
  issues: string[];
}

type EnvSource = Readonly<Record<string, string | boolean | undefined>>;

function readString(env: EnvSource, key: string): string {
  const value = env[key];
  return typeof value === 'string' ? value.trim() : '';
}

function decodeJwtRole(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload: unknown = JSON.parse(atob(base64));
    if (payload && typeof payload === 'object' && 'role' in payload && typeof payload.role === 'string') {
      return payload.role;
    }
  } catch {
    return null;
  }
  return null;
}

export function isForbiddenSecretKey(key: string): boolean {
  if (key.startsWith('sb_secret_')) return true;
  return decodeJwtRole(key) === 'service_role';
}

function isAllowedSupabaseUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol === 'https:') return true;
    return url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
  } catch {
    return false;
  }
}

export function readRuntimeConfig(env: EnvSource): RuntimeConfig {
  const url = readString(env, 'VITE_SUPABASE_URL');
  const publishableKey = readString(env, 'VITE_SUPABASE_PUBLISHABLE_KEY');
  const issues: string[] = [];

  if (!url && !publishableKey) return { supabase: null, issues };

  if (!url || !publishableKey) {
    issues.push('Supabase parcialmente configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
  if (url && !isAllowedSupabaseUrl(url)) {
    issues.push('VITE_SUPABASE_URL inválida: use https:// (http:// apenas para localhost).');
  }
  if (publishableKey && isForbiddenSecretKey(publishableKey)) {
    issues.push('Chave secreta/service_role recusada no frontend. Use somente a chave publicável.');
  }

  return issues.length > 0 ? { supabase: null, issues } : { supabase: { url, publishableKey }, issues };
}
