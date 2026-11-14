import { describe, expect, it } from 'vitest';
import { seedDemands } from '../../src/data/seed-demands';
import { suggestClusters } from '../../src/services/clusterService';

describe('painel AC — contagem e cluster', () => {
  it('quatro seeds produzem contagem real 4 e um bucket B', () => {
    expect(seedDemands).toHaveLength(4);
    const clusters = suggestClusters(seedDemands);
    const bucket = clusters.find((c) =>
      c.signature.includes('stock_confirmation_delay|manual|no_erp|whatsapp'),
    );
    expect(bucket).toBeTruthy();
    expect(bucket!.distinctRecordCount).toBe(4);
    expect(bucket!.associationCodes).toEqual(['ac_alfa', 'ac_beta']);
  });

  it('não hardcoda total 5', () => {
    const clusters = suggestClusters(seedDemands);
    const total = new Set(clusters.flatMap((c) => c.needIds)).size;
    expect(total).toBe(4);
  });
});
