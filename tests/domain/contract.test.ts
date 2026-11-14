import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  CATALOG_VERSION,
  MATCH_RULES_VERSION,
  SCHEMA_VERSION,
  type MatchResult,
  type NewQualifiedNeed,
  type QualifiedNeed,
} from '../../src/domain/types';

// Verifica a materialização dos tipos do DATA_MODEL v1.0.0 §4; não testa regras de matching (AG-07).
describe('contrato de domínio v1', () => {
  it('fixa as versões do contrato', () => {
    expect(SCHEMA_VERSION).toBe(1);
    expect(MATCH_RULES_VERSION).toBe('match-v1');
    expect(CATALOG_VERSION).toBe('catalog-v1');
  });

  it('MatchResult inelegível ou needs_information não admite score', () => {
    type Ineligible = Extract<MatchResult, { outcome: 'ineligible' }>;
    type NeedsInfo = Extract<MatchResult, { outcome: 'needs_information' }>;
    type Eligible = Extract<MatchResult, { outcome: 'eligible' }>;
    expectTypeOf<Ineligible['score']>().toEqualTypeOf<undefined>();
    expectTypeOf<NeedsInfo['score']>().toEqualTypeOf<undefined>();
    expectTypeOf<Eligible['score']>().toEqualTypeOf<number>();
  });

  it('NewQualifiedNeed não envia campos derivados pelo servidor', () => {
    expectTypeOf<NewQualifiedNeed>().not.toHaveProperty('createdAt');
    expectTypeOf<NewQualifiedNeed>().not.toHaveProperty('demoClusterKey');
    expectTypeOf<NewQualifiedNeed['origin']>().toEqualTypeOf<'remote'>();
    expectTypeOf<QualifiedNeed['status']>().toEqualTypeOf<'qualified'>();
  });
});
