import { useParams } from 'react-router';
import { BriefView } from '../features/brief/BriefView';

export function BriefPage() {
  const { needId } = useParams();
  if (!needId) return <p role="alert">ID ausente.</p>;
  return <BriefView needId={needId} />;
}
