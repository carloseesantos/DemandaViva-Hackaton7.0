export class RepositoryNotConfiguredError extends Error {
  constructor(operation: string) {
    super(
      `DemandRepository.${operation}() indisponível: adaptador ainda não implementado (AG-06/AG-08). ` +
        'Nenhum dado foi lido ou gravado.',
    );
    this.name = 'RepositoryNotConfiguredError';
  }
}

/** Seeds são somente leitura; INSERT remoto não se aplica a fixtures do bundle. */
export class SeedReadOnlyError extends Error {
  constructor() {
    super(
      'StaticSeedRepository.save() recusado: seeds locais são somente leitura e não vão para o Supabase.',
    );
    this.name = 'SeedReadOnlyError';
  }
}

/** Persistência remota ausente ou bloqueada (sem env, G1S ou rede). */
export class RemoteUnavailableError extends Error {
  readonly retryAllowed = true as const;

  constructor(reason: string) {
    super(
      `Persistência remota indisponível: ${reason}. ` +
        'Catálogo e seeds locais continuam; novas demandas não serão compartilhadas entre navegadores.',
    );
    this.name = 'RemoteUnavailableError';
  }
}

/** Payload rejeitado pela validação de contrato antes de qualquer chamada remota. */
export class DemandValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Ficha qualificada inválida: ${issues.join('; ')}`);
    this.name = 'DemandValidationError';
    this.issues = issues;
  }
}

/** Resposta remota incompatível com schema v1 ou RLS. */
export class DemandMappingError extends Error {
  constructor(reason: string) {
    super(`Mapeamento demo_demands falhou: ${reason}`);
    this.name = 'DemandMappingError';
  }
}

/** Colisão de UUID: seed local tem prioridade; remoto não sobrescreve fixture. */
export class SeedRemoteIdCollisionError extends Error {
  readonly seedId: string;

  constructor(seedId: string) {
    super(
      `Colisão de UUID entre seed e remoto (${seedId}): fixture local preservada; incidente de dados.`,
    );
    this.name = 'SeedRemoteIdCollisionError';
    this.seedId = seedId;
  }
}
