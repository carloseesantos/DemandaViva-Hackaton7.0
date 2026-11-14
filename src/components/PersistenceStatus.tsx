import type { PersistenceState } from '../domain/types';
import { Button } from './Button';

type Props = {
  state: PersistenceState;
  remoteSharingEnabled: boolean;
  onRetry?: () => void;
};

export function PersistenceStatus({ state, remoteSharingEnabled, onRetry }: Props) {
  if (!remoteSharingEnabled && state.state === 'local_draft') {
    return (
      <div role="status" className="dv-banner dv-status--offline">
        A sincronização entre navegadores não está habilitada nesta versão. O diagnóstico continua
        disponível localmente.
      </div>
    );
  }

  switch (state.state) {
    case 'local_draft':
      return (
        <div role="status" className="dv-banner dv-status--processing">
          Sua demanda fictícia está pronta para registro.
        </div>
      );
    case 'saving':
      return (
        <div role="status" className="dv-banner dv-status--processing" aria-busy="true">
          Salvando demanda de demonstração…
        </div>
      );
    case 'synced':
      return (
        <div role="status" className="dv-banner dv-status--recommended">
          Demanda registrada na nuvem para esta demonstração. ID: {state.id}.
        </div>
      );
    case 'sync_failed':
      return (
        <div role="alert" className="dv-banner dv-status--offline">
          <p>Não foi possível sincronizar. A demanda não está confirmada na nuvem.</p>
          {onRetry && state.retryAllowed && (
            <Button variant="secondary" onClick={onRetry}>
              Tentar novamente
            </Button>
          )}
        </div>
      );
  }
}
