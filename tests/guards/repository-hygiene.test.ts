import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findPii, findSecrets } from '../../scripts/repo-guards.mjs';

const root = join(import.meta.dirname, '..', '..');

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const textFile = /\.(ts|tsx|js|mjs|json|css|html|sql|md|example)$/;

describe('higiene do repositório', () => {
  it('.env.example só declara as duas variáveis públicas, vazias', () => {
    const lines = readFileSync(join(root, '.env.example'), 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
    expect(lines).toEqual(['VITE_SUPABASE_URL=', 'VITE_SUPABASE_PUBLISHABLE_KEY=']);
  });

  it('nenhum segredo em src/, supabase/, tests/ ou arquivos raiz', () => {
    const files = [
      ...walk(join(root, 'src')),
      ...walk(join(root, 'supabase')),
      ...walk(join(root, 'tests')),
      join(root, '.env.example'),
      join(root, 'index.html'),
      join(root, 'vite.config.ts'),
    ].filter((file) => textFile.test(file));
    const offenders = files
      .map((file) => ({ file: relative(root, file), hits: findSecrets(readFileSync(file, 'utf8')) }))
      .filter(({ hits }) => hits.length > 0);
    expect(offenders).toEqual([]);
  });

  it('fixtures em src/data não contêm padrões de dado pessoal', () => {
    const offenders = walk(join(root, 'src', 'data'))
      .filter((file) => textFile.test(file))
      .map((file) => ({ file: relative(root, file), hits: findPii(readFileSync(file, 'utf8')) }))
      .filter(({ hits }) => hits.length > 0);
    expect(offenders).toEqual([]);
  });
});
