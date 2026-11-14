// Padrões compartilhados entre tests/guards e scripts/verify-spa-build.mjs.

export const SECRET_PATTERNS = [
  { name: 'Supabase secret key', regex: /sb_secret_[A-Za-z0-9_-]{8,}/ },
  { name: 'Postgres connection string', regex: /postgres(?:ql)?:\/\/[^\s'"`]+:[^\s'"`]+@/ },
  { name: 'Private key block', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

const JWT_REGEX = /eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+/g;

export function findServiceRoleJwts(text) {
  const hits = [];
  for (const match of text.matchAll(JWT_REGEX)) {
    const payload = match[0].split('.')[1];
    try {
      const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      if (decoded?.role === 'service_role') hits.push(match[0].slice(0, 12) + '…');
    } catch {
      // não é JWT válido
    }
  }
  return hits;
}

export function findSecrets(text) {
  const found = SECRET_PATTERNS.filter(({ regex }) => regex.test(text)).map(({ name }) => name);
  if (findServiceRoleJwts(text).length > 0) found.push('JWT service_role');
  return found;
}

// Indícios de dado pessoal real em fixtures; fixtures devem ser exclusivamente sintéticas.
export const PII_PATTERNS = [
  { name: 'CPF', regex: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/ },
  { name: 'CNPJ', regex: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/ },
  { name: 'e-mail', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/ },
  { name: 'telefone BR', regex: /\(?\b\d{2}\)?\s?9?\d{4}-?\d{4}\b/ },
];

export function findPii(text) {
  return PII_PATTERNS.filter(({ regex }) => regex.test(text)).map(({ name }) => name);
}
