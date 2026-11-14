import { useParams } from 'react-router';
import { CallDetail } from '../features/startup/CallDetail';

export function StartupCallPage() {
  const { callId } = useParams();
  if (!callId) return <p role="alert">Chamada ausente.</p>;
  return <CallDetail callId={decodeURIComponent(callId)} />;
}
