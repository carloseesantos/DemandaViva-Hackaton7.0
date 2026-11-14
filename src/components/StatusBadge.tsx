type Tone =
  | 'recommended'
  | 'conditional'
  | 'ineligible'
  | 'insufficient'
  | 'processing'
  | 'offline'
  | 'demo'
  | 'simulated';

const CLASS: Record<Tone, string> = {
  recommended: 'dv-badge dv-status--recommended',
  conditional: 'dv-badge dv-status--conditional',
  ineligible: 'dv-badge dv-status--ineligible',
  insufficient: 'dv-badge dv-status--insufficient',
  processing: 'dv-badge dv-status--processing',
  offline: 'dv-badge dv-status--offline',
  demo: 'dv-badge dv-status--demo',
  simulated: 'dv-badge dv-status--processing',
};

export function StatusBadge({ tone, children }: { tone: Tone; children: string }) {
  return <span className={CLASS[tone]}>{children}</span>;
}
