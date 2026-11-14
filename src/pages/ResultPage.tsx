import { useParams } from 'react-router';
import { ResultView } from '../features/result/ResultView';

export function ResultPage() {
  const { needId } = useParams();
  if (!needId) return <p role="alert">ID da necessidade ausente.</p>;
  return <ResultView key={needId} needId={needId} />;
}
