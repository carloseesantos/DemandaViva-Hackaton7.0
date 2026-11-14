export class RepositoryNotConfiguredError extends Error {
  constructor(operation: string) {
    super(
      `DemandRepository.${operation}() indisponível: adaptador ainda não implementado (AG-06/AG-08). ` +
        'Nenhum dado foi lido ou gravado.',
    );
    this.name = 'RepositoryNotConfiguredError';
  }
}
