/** Contraprovas AG-06 — SOMENTE testes. D/E não devem entrar no bundle ou painel. */
import type {QualifiedNeed, Solution, UUID} from '../../src/domain/types';
import {demoScenarioA} from '../../src/data/scenarios/demo-scenarios';
import {deriveDemoClusterKey,makeDemoRequirement} from '../../src/data/registries';
import {solutions} from '../../src/data/solutions';

/** D: texto idêntico aos seeds, mas processo via ERP e veto absoluto ao compartilhamento.
 * assinatura digital/ERP e gate data_privacy falho: não misturar com cluster B.
 */
export const negativeScenarioD:QualifiedNeed=(()=>{
  const id='d0a11000-0000-4000-8000-000000000006' as UUID;
  return {...demoScenarioA,id,segmentCode:'fashion',origin:'scenario_fixture',
    requirements:[makeDemoRequirement(id,'stock_lookup','mandatory'),
      makeDemoRequirement(id,'privacy_preserving','mandatory')],
    constraints:{...demoScenarioA.constraints,dataSharing:'none',trainingMaxHours:2},
    demoClusterKey:deriveDemoClusterKey('stock_confirmation_delay','erp_lookup',true,'whatsapp')};
})();

/** E: estoque, ERP X, orçamento baixo (teto rígido R$ 200/mês). O catálogo ATUAL
 * custa R$ 199 e portanto NÃO reprova orçamento. Para testar hard_budget,
 * usar APENAS a solução clonada abaixo, R$ 299/mês, sem alterar catálogo AG-05.
 */
export const negativeScenarioE:QualifiedNeed=(()=>{
  const id='e0a12000-0000-4000-8000-000000000006' as UUID;
  return {...demoScenarioA,id,origin:'scenario_fixture',
    requirements:[makeDemoRequirement(id,'stock_lookup','mandatory')],
    constraints:{...demoScenarioA.constraints,budgetBand:'low'}};
})();

const original=solutions.find(s=>s.id==='solution:estoqueponte-v1');
if(!original) throw new Error('Catálogo AG-05: EstoquePonte ausente');
/** Override exclusivo do teste E: simula alteração de preço que torna o custo incompatível. */
export const overBudgetEstoquePonte:Solution={...original,minimumMonthlyCostCents:29900};
