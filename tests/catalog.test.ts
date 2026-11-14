/**
 * AG-05: 5 casos executáveis, SEM hardcode do score no motor.
 * Rode: tsc -p tsconfig.json && node dist/tests/catalog.check.js
 */
import { it } from 'vitest';
import { startups } from '../src/data/startups';
import { catalogEvidence, solutions, solutionDisplayDetails } from '../src/data/solutions';
import { evaluateCatalog, evaluateSolution } from './support/referenceMatcher';
import { scenarioA,scenarioB,scenarioC,scenarioD,scenarioE } from './scenarios';

const NOW='2026-11-14T21:20:00Z';
function assert(ok:unknown, explanation:string):asserts ok {
  if(!ok)throw new Error(explanation);
}
function eq<T>(actual:T,expected:T,message:string):void{
  assert(actual===expected,`${message}: obtido=${String(actual)}, esperado=${String(expected)}`);
}
function comparable(x:unknown){return JSON.stringify(x);}
const run = it;

run('CT-01 | A: EstoquePonte, seis gates pass e 90 calculado',()=>{
  const a=evaluateCatalog(scenarioA,NOW);
  eq(a.status,'recommended','A deve recomendar');
  const s=a.results.find(x=>x.solutionId==='solution:estoqueponte-v1');
  assert(s&&s.outcome==='eligible','A precisa ser elegível');
  eq(s.gates.length,6,'Seis gates');
  assert(s.gates.every(g=>g.status==='pass'),'Todos os gates devem passar');
  eq(s.breakdown.map(x=>x.rating).join(','),'5,5,4,4,4','Cinco ratings derivados de dados');
  eq(s.score,90,'Score derivado de pesos e notas');
  eq(s.score,Number((s.breakdown.reduce((acc,c)=>acc+c.weight*c.rating/5,0)).toFixed(1)),'Recalcular fórmula');
  eq(comparable(evaluateCatalog(scenarioA,NOW)),comparable(a),'Determinismo na mesma data');
});
run('CT-02 | B: sem ERP não tem match, nem score serializado',()=>{
  const b=evaluateCatalog(scenarioB,NOW);
  eq(b.status,'no_eligible_catalog_solution','B deve ir a briefing');
  assert(b.results.every(r=>r.outcome==='ineligible'),'Nenhum produto poderá ficar elegível para B');
  const stock=b.results.find(x=>x.solutionId==='solution:estoqueponte-v1');
  assert(stock&&stock.outcome==='ineligible','EstoquePonte recusada');
  assert(stock.failedGateCodes.includes('technical_dependencies'),'Reprovado pela ausência de ERP X');
  assert(!Object.hasOwn(stock,'score')&&!Object.hasOwn(stock,'breakdown'),'Não materializar score/breakdown');
  assert(!JSON.stringify(b).includes('"score"'),'Nenhum score para B');
});
run('CT-03 | C: dados insuficientes, nenhum candidato pontuado ou enviado',()=>{
  const c=evaluateCatalog(scenarioC,NOW);
  eq(c.status,'insufficient_data','C não é ausência de solução');
  eq(c.results.length,0,'Nenhum match avaliado');
  assert(scenarioC.localOnly&&scenarioC.missingFields.includes('metric'),'Draft só local: INSERT não permitido');
  assert(!Object.hasOwn(c,'topSolutionId'),'Sem recomendação');
});
run('CT-04 | D: solução parcial elegível, faixa 65–79 CONDICIONAL',()=>{
  const d=evaluateCatalog(scenarioD,NOW);
  eq(d.status,'conditional','D não pode ser recomendado definitivamente');
  const product=d.results.find(x=>x.solutionId==='solution:vitrineretorno-v1');
  assert(product&&product.outcome==='eligible','VitrineRetorno deve passar todos os gates');
  assert(product.score>=65&&product.score<80,'Score derivado na faixa condicional');
  eq(product.score,72,'D deve ter referência reproduzível 72 pela fórmula');
  eq(product.recommendation,'conditional','Rotular parcialmente');
});
run('CT-05 | ficha expirada e preço unknown não viram match',()=>{
  const expired=solutions.find(x=>x.id==='solution:visordelegado-v1');
  const unknown=solutions.find(x=>x.id==='solution:fechorapido-v1');
  assert(expired&&unknown,'Fixtures presentes');
  const resultExpired=evaluateSolution(scenarioA,expired,NOW);
  eq(resultExpired.outcome,'ineligible','Expirada é inelegível');
  assert(resultExpired.gates.some(g=>g.code==='curation_evidence'&&g.status==='fail'),'Curadoria bloqueia expirada');
  assert(!Object.hasOwn(resultExpired,'score'),'Expirada sem score');
  const resultUnknown=evaluateSolution(scenarioE,unknown,NOW);
  eq(resultUnknown.outcome,'needs_information','Custo desconhecido demanda informação');
  assert(resultUnknown.gates.some(g=>g.code==='hard_budget'&&g.status==='unknown'),'Preço unknown sem suposições');
  assert(!Object.hasOwn(resultUnknown,'score'),'Sem score por dados críticos desconhecidos');
  // Integridade e origem sintética verificadas no mesmo teste de curadoria.
  const startupIds=new Set(startups.map(s=>s.id));
  assert(startupIds.size===4&&solutions.length===5,'Exatamente 4 startups, 5 soluções');
  assert(new Set(solutions.map(s=>s.id)).size===5,'IDs de soluções únicos');
  assert(new Set(catalogEvidence.map(e=>e.id)).size===catalogEvidence.length,'IDs de evidências únicos');
  for(const solution of solutions){
    assert(startupIds.has(solution.startupId)&&solution.isDemo,'FK lógica/startup e demo');
    assert(solutionDisplayDetails[solution.id]?.simulationNotice.startsWith('SIMULADO'),'Rótulo UX');
    assert(solution.catalogVersion==='catalog-v1','Versão correta');
    assert(solution.evidenceIds.every(id=>catalogEvidence.some(e=>e.id===id&&e.solutionId===solution.id)),'Evidence FK');
    assert(startups.some(s=>s.id===solution.startupId&&s.solutionIds.includes(solution.id)),'Relação bidirecional');
  }
  assert(catalogEvidence.every(e=>e.sourceMode==='synthetic'),'Nunca usar evidência real no MVP');
});
// O motor de referência é somente um oráculo de testes do catálogo; não substitui AG-07.
