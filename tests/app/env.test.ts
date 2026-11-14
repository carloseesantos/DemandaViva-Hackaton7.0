import { describe, expect, it } from 'vitest';
import { isForbiddenSecretKey, readRuntimeConfig } from '../../src/app/env';

// Montada em runtime para que o texto-fonte não contenha um padrão de chave secreta.
const FAKE_SECRET_KEY = ['sb', 'secret', 'exemploFicticio123'].join('_');

function fakeJwt(role: string): string {
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=+$/, '');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ role, iss: 'supabase-demo' })}.assinatura-ficticia`;
}

describe('readRuntimeConfig', () => {
  it('sem variáveis entra em modo local, sem erro', () => {
    expect(readRuntimeConfig({})).toEqual({ supabase: null, issues: [] });
  });

  it('aceita URL https e chave publicável', () => {
    const config = readRuntimeConfig({
      VITE_SUPABASE_URL: 'https://exemplo-ficticio.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_exemploFicticio123',
    });
    expect(config.issues).toEqual([]);
    expect(config.supabase).toEqual({
      url: 'https://exemplo-ficticio.supabase.co',
      publishableKey: 'sb_publishable_exemploFicticio123',
    });
  });

  it('aceita chave anon legada (JWT role=anon)', () => {
    const config = readRuntimeConfig({
      VITE_SUPABASE_URL: 'https://exemplo-ficticio.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: fakeJwt('anon'),
    });
    expect(config.supabase).not.toBeNull();
  });

  it.each([
    ['sb_secret_', FAKE_SECRET_KEY],
    ['JWT service_role', fakeJwt('service_role')],
  ])('recusa chave secreta (%s) e cai para modo local', (_label, key) => {
    const config = readRuntimeConfig({
      VITE_SUPABASE_URL: 'https://exemplo-ficticio.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: key,
    });
    expect(config.supabase).toBeNull();
    expect(config.issues.join(' ')).toMatch(/recusada/);
    expect(config.issues.join(' ')).not.toContain(key);
  });

  it('recusa configuração parcial', () => {
    const config = readRuntimeConfig({ VITE_SUPABASE_URL: 'https://exemplo-ficticio.supabase.co' });
    expect(config.supabase).toBeNull();
    expect(config.issues).toHaveLength(1);
  });

  it('recusa URL http fora de localhost', () => {
    const config = readRuntimeConfig({
      VITE_SUPABASE_URL: 'http://exemplo-ficticio.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_exemploFicticio123',
    });
    expect(config.supabase).toBeNull();
  });

  it('isForbiddenSecretKey ignora texto que não é chave', () => {
    expect(isForbiddenSecretKey('sb_publishable_x')).toBe(false);
    expect(isForbiddenSecretKey('nao.e.jwt')).toBe(false);
  });
});
