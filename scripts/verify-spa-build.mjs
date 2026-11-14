// Verificações pós-build para Cloudflare Pages (executado por `npm run build`).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findSecrets } from './repo-guards.mjs';

const dist = new URL('../dist/', import.meta.url).pathname;
const errors = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

if (!existsSync(join(dist, 'index.html'))) {
  errors.push('dist/index.html ausente.');
}

// Pages só ativa o fallback de SPA (deep links) quando NÃO existe 404.html na raiz da saída.
if (existsSync(join(dist, '404.html'))) {
  errors.push('dist/404.html presente: desativaria o fallback de SPA do Cloudflare Pages.');
}

if (existsSync(dist)) {
  for (const file of walk(dist)) {
    if (!/\.(js|html|css|json|txt|map)$/.test(file)) continue;
    const hits = findSecrets(readFileSync(file, 'utf8'));
    if (hits.length > 0) errors.push(`${relative(dist, file)}: possível segredo (${hits.join(', ')}).`);
  }
}

if (errors.length > 0) {
  console.error('verify-spa-build: FALHOU');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('verify-spa-build: OK (index.html presente, sem 404.html na raiz, sem segredos detectados)');
