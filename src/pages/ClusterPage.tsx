import { useParams } from 'react-router';
import { ClusterDetail } from '../features/ac/ClusterDetail';

export function ClusterPage() {
  const { clusterId } = useParams();
  if (!clusterId) return <p role="alert">Cluster ausente.</p>;
  return <ClusterDetail clusterId={decodeURIComponent(clusterId)} />;
}
