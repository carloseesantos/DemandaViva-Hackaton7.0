import {describe,expect,it} from 'vitest';
import {seedDemands,seedDemoNarrative} from '../../src/data/seed-demands';
import {associations} from '../../src/data/associations';
import {demoScenarioA,demoScenarioC} from '../../src/data/scenarios/demo-scenarios';
import {PAIN_TEMPLATES,deriveDemoClusterKey,REQUIREMENT_REGISTRY} from '../../src/data/registries';
import {evaluateCatalog,evaluateSolution} from '../support/referenceMatcher';
import {solutions} from '../../src/data/solutions';
import {negativeScenarioD,negativeScenarioE,overBudgetEstoquePonte} from '../fixtures/ag06-negative-scenarios';
import type {QualifiedNeed} from '../../src/domain/types';

const NOW='2026-11-14T21:20:00Z';
const uuidV4=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/;

describe('AG-06 | quatro seeds sintéticas e contrato AG-01',()=>{
  it('preserva quatro IDs v4 determinísticos de duas ACs, com relato independente',()=>{
    expect(seedDemands).toHaveLength(4);
    expect(seedDemands.map(x=>x.id)).toEqual([1,2,3,4].map(i=>`e0a11000-0000-4000-8000-00000000000${i}`));
    expect(new Set(seedDemands.map(x=>x.id)).size).toBe(4);
    expect(seedDemands.map(x=>x.associationCode)).toEqual(['ac_alfa','ac_alfa','ac_beta','ac_beta']);
    expect(associations.map(x=>x.code)).toEqual(['ac_alfa','ac_beta']);
    expect(Object.keys(seedDemoNarrative)).toHaveLength(4);
  });
  it('campos de Need e Requirements são válidos, sem ERP ou PII',()=>{
    for(const n of seedDemands){
      expect(n.id).toMatch(uuidV4);
      expect(n.origin).toBe('seed');expect(n.schemaVersion).toBe(1);expect(n.isDemo).toBe(true);
      expect(n.hasErp).toBe(false);expect(n.erpCode).toBeNull();
      expect(n.status).toBe('qualified');expect(n.painCode).toBe('stock_confirmation_delay');
      expect(n.channelCode).toBe('whatsapp');
      expect(n.problemSummary).toBe(PAIN_TEMPLATES.stock_confirmation_delay);
      expect(n.demoClusterKey).toBe(deriveDemoClusterKey(n.painCode,n.processCode,n.hasErp,n.channelCode));
      expect(n.metric).toEqual({code:'confirmation_minutes',baseline:7,target:2});
      expect(n.requirements.some(r=>r.kind==='mandatory'&&r.code==='no_erp_dependency')).toBe(true);
      expect(n.requirements.some(r=>r.kind==='mandatory'&&r.code==='stock_lookup')).toBe(true);
      expect(n.requirements.length).toBeLessThanOrEqual(8);
      const codes=n.requirements.map(r=>r.code);expect(new Set(codes).size).toBe(codes.length);
      for(const req of n.requirements){
        expect(req.id).toBe(`req:${n.id}:${req.code}`);
        expect(req.description).toBe(REQUIREMENT_REGISTRY[req.code].description);
        expect(req.acceptanceCriterion).toBe(REQUIREMENT_REGISTRY[req.code].acceptanceCriterion);
      }
      expect(n.problemSummary).not.toMatch(/@|\b\d{3}\.\d{3}\.\d{3}\b/);
    }
  });
  it('quatro seeds -> um bucket base candidato, sem contar A/C/D/E',()=>{
    expect(new Set(seedDemands.map(x=>x.demoClusterKey))).toEqual(new Set([
      'stock_confirmation_delay|manual|no_erp|whatsapp',
    ]));
    expect(seedDemands.every(n=>n.id!==demoScenarioA.id&&n.id!==demoScenarioC.id)).toBe(true);
  });
  it('B: EstoquePonte reprovado no gate técnico SEM score',()=>{
    for(const need of seedDemands){
      const r=evaluateCatalog(need,NOW);
      expect(r.status).toBe('no_eligible_catalog_solution');
      const esto=r.results.find(x=>x.solutionId==='solution:estoqueponte-v1');
      expect(esto?.outcome).toBe('ineligible');
      if(esto?.outcome!=='ineligible') throw new Error('Gate técnico não aplicado');
      expect(esto.failedGateCodes).toContain('technical_dependencies');
      expect(esto).not.toHaveProperty('score');
    }
  });
  it('A: caso ERP X é separado e retorna 90 apenas no executor de referência AG-05',()=>{
    const e=evaluateCatalog(demoScenarioA,NOW);
    expect(e.status).toBe('recommended');
    const match=e.results.find(x=>x.solutionId==='solution:estoqueponte-v1');
    expect(match?.outcome).toBe('eligible');
    if(match?.outcome!=='eligible')throw new Error('A não elegível');
    expect(match.score).toBe(90);
    expect(match.breakdown.map(c=>c.rating)).toEqual([5,5,4,4,4]);
    expect(match.gates.every(g=>g.status==='pass')).toBe(true);
  });
  it('C: diagnóstico incompleto nunca vira QualifiedNeed nem INSERT',()=>{
    expect(demoScenarioC.status).toBe('insufficient_data');
    expect(demoScenarioC.localOnly).toBe(true);
    expect(evaluateCatalog(demoScenarioC,NOW).status).toBe('insufficient_data');
    expect(evaluateCatalog(demoScenarioC,NOW).results).toEqual([]);
  });
  it('D: texto idêntico, contexto/assinatura diferente e privacidade bloqueante',()=>{
    expect(negativeScenarioD.problemSummary).toBe(seedDemands[0].problemSummary);
    expect(negativeScenarioD.demoClusterKey).not.toBe(seedDemands[0].demoClusterKey);
    const esto=solutions.find(s=>s.id==='solution:estoqueponte-v1');
    if(!esto)throw new Error('Solução não encontrada');
    const result=evaluateSolution(negativeScenarioD,esto,NOW);
    expect(result.outcome).toBe('ineligible');
    if(result.outcome!=='ineligible')throw new Error('Privacidade não bloqueou');
    expect(result.failedGateCodes).toContain('data_privacy');
    expect(result).not.toHaveProperty('score');
  });
  it('E: orçamento somente bloqueia com variante R$ 299, sem mutação do catálogo',()=>{
    const real=solutions.find(s=>s.id==='solution:estoqueponte-v1');
    expect(real?.minimumMonthlyCostCents).toBe(19900);
    expect(negativeScenarioE.constraints.budgetBand).toBe('low');
    const realResult=evaluateSolution(negativeScenarioE,real!,NOW);
    expect(realResult.gates.find(g=>g.code==='hard_budget')?.status).toBe('pass');
    const variantResult=evaluateSolution(negativeScenarioE,overBudgetEstoquePonte,NOW);
    expect(variantResult.outcome).toBe('ineligible');
    expect(variantResult.gates.find(g=>g.code==='hard_budget')?.status).toBe('fail');
    expect(variantResult).not.toHaveProperty('score');
    expect(solutions.find(s=>s.id==='solution:estoqueponte-v1')?.minimumMonthlyCostCents).toBe(19900);
  });
  it('merge lógico é por UUID, nunca pelo texto de dor',()=>{
    const extra={...seedDemands[0],id:'e0a11000-0000-4000-8000-000000000005' as QualifiedNeed['id'],origin:'remote' as const};
    const merged=new Map([...seedDemands,extra,seedDemands[0]].map(n=>[n.id,n]));
    expect(merged.size).toBe(5);
  });
});
