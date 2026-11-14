/**
 * EXECUTOR DE REFERÊNCIA SOMENTE PARA TESTES AG-05.
 * Não substituir o MatchingService de produção, sob ownership do AG-07.
 * Implementa os gates e a régua PROPOSTOS no Doc 02 / DATA_MODEL v1.0.0,
 * sem nenhum score de cenário pré-atribuído ao catálogo.
 */
import {
  MATCH_RULES_VERSION,
} from '../../src/domain/types';
import type {
  CatalogEvidence, DataSharing, GateCode, GateResult, MatchEvaluation,
  MatchResult, Need, QualifiedNeed, ScoreComponent, ScoreCriterion, Solution,
} from '../../src/domain/types';
import { BUDGET_CAP_CENTS, DEMO_REGION_CODE } from '../../src/data/catalog-enums';
import { catalogEvidence, solutionDisplayDetails, solutions } from '../../src/data/solutions';

type GateStatus = GateResult['status'];
type CriterionWeight = 15|20|30;
const CRITERIA: ReadonlyArray<{criterion:ScoreCriterion; weight:CriterionWeight}> = [
  {criterion:'functional',weight:30},
  {criterion:'technical',weight:20},
  {criterion:'economic',weight:20},
  {criterion:'operation',weight:15},
  {criterion:'evidence',weight:15},
];
const FUNCTION_CODES = new Set(['stock_lookup', 'whatsapp_workflow', 'multi_store', 'manual_stock_update']);
const SHARING_RANK: Record<DataSharing,number>={none:0,restricted:1,allowed:2};
const ISO = (value: string) => Date.parse(value);
function gate(code:GateCode, status:GateStatus, reason:string, evidenceIds:string[]=[]):GateResult {
  return {code,status,reason,evidenceIds};
}
function validEvidence(solution:Solution, evidence:readonly CatalogEvidence[], now:string):CatalogEvidence[] {
  return evidence.filter(e =>
    solution.evidenceIds.includes(e.id) && e.solutionId===solution.id &&
    e.sourceMode==='synthetic' && e.reviewStatus==='valid_for_demo' &&
    ISO(e.checkedAt)<=ISO(now) && ISO(e.expiresAt)>=ISO(now)
  );
}
function scoreBreakdown(need:QualifiedNeed, solution:Solution, goodEvidenceCount:number):ScoreComponent[] {
  const optional=need.requirements.filter(r=>r.kind==='optional');
  const totalOptional=optional.reduce((sum,r)=>sum+(4-r.priority),0);
  const coveredOptional=optional.filter(r=>solution.coveredRequirements.includes(r.code))
    .reduce((sum,r)=>sum+(4-r.priority),0);
  const functional = totalOptional===0 ? 5 :
    Math.max(1,Math.round(5*coveredOptional/totalOptional));

  // O gate técnico já assegurou as dependências; sem lacuna adicional, 5/5.
  const technical=5;
  const monthly=solution.minimumMonthlyCostCents;
  if(monthly===null) throw new Error('Nunca pontuar custo unknown');
  const ratio=monthly/BUDGET_CAP_CENTS[need.constraints.budgetBand];
  const economic = ratio<=0.30?5:ratio<=0.60?4:ratio<=0.80?3:ratio<=1?2:0;
  const hours=solution.implantationHours;
  if(hours===null) throw new Error('Nunca pontuar implantação unknown');
  const operation = hours<=4?5:hours<=12?4:hours<=24?3:hours<=48?2:1;
  const maturity = goodEvidenceCount>=4?5:goodEvidenceCount===3?4:goodEvidenceCount===2?3:goodEvidenceCount===1?2:0;
  const ratings:Record<ScoreCriterion,number>={functional,technical,economic,operation,evidence:maturity};
  return CRITERIA.map(({criterion,weight})=>{
    const r=ratings[criterion];
    if(!Number.isInteger(r)||r<0||r>5)throw new Error('Rating inválido');
    return {criterion,weight,rating:r as ScoreComponent['rating'],points:weight*r/5};
  });
}

export function evaluateSolution(
  need:QualifiedNeed, solution:Solution, evaluatedAt:string,
  evidence:readonly CatalogEvidence[]=catalogEvidence,
):MatchResult {
  const details=solutionDisplayDetails[solution.id];
  if(!details)throw new Error(`Metadados de UX ausentes: ${solution.id}`);
  const goodEvidence=validEvidence(solution,evidence,evaluatedAt);
  const ev=goodEvidence.map(x=>x.id);
  const mandatory=need.requirements.filter(r=>r.kind==='mandatory').map(r=>r.code);
  const missingFunctions=mandatory.filter(r=>FUNCTION_CODES.has(r)&&!solution.coveredRequirements.includes(r));
  const handlesPain=solution.essentialPainCodes.includes(need.painCode);
  const gEssential=gate('essential_function',handlesPain&&missingFunctions.length===0?'pass':'fail',
    !handlesPain?`Solução não atende à dor ${need.painCode}`:
      missingFunctions.length?`Função obrigatória ausente: ${missingFunctions.join(', ')}`:'Função essencial declarada na simulação',ev);

  const missingSystems=solution.requiredSystems.filter(code => !(need.hasErp&&need.erpCode===code));
  const requiresNoErp=mandatory.includes('no_erp_dependency');
  const training=details.support.trainingHours;
  const technicalProblems:string[]=[];
  const technicalUnknown:string[]=[];
  if(missingSystems.length)technicalProblems.push(`Exige ${missingSystems.join(', ')} indisponível`);
  if(requiresNoErp&&solution.requiredSystems.length)technicalProblems.push('Requisito obrigatório de operar sem ERP não atendido');
  if(training===null)technicalUnknown.push('Horas de treinamento não confirmadas');
  else if(training>need.constraints.trainingMaxHours)technicalProblems.push(`Treinamento ${training}h ultrapassa teto ${need.constraints.trainingMaxHours}h`);
  if(mandatory.includes('short_training') && !solution.coveredRequirements.includes('short_training'))
    technicalProblems.push('Treinamento curto obrigatório não coberto');
  if(need.constraints.offlineRequired&&!details.offlineSupported)technicalProblems.push('Operação offline não suportada');
  const gTechnical=gate('technical_dependencies',technicalProblems.length?'fail':technicalUnknown.length?'unknown':'pass',
    [...technicalProblems,...technicalUnknown].join('; ')||'Dependências técnicas e treinamento compatíveis',ev);

  const cost=solution.minimumMonthlyCostCents;
  const cap=BUDGET_CAP_CENTS[need.constraints.budgetBand];
  const gBudget=gate('hard_budget',cost===null?'unknown':cost>cap?'fail':'pass',
    cost===null?'Preço mínimo desconhecido, solicitar cotação antes de recomendar':
    cost>cap?`Mínimo sintético R$ ${(cost/100).toFixed(2)} acima do teto sintético R$ ${(cap/100).toFixed(2)}`:
      'Custo mínimo mensal sintético dentro do teto informado');

  const hasPrivacyRequirement=mandatory.includes('privacy_preserving');
  const privacyOk=SHARING_RANK[solution.dataSharingRequired]<=SHARING_RANK[need.constraints.dataSharing]
    &&(!hasPrivacyRequirement || solution.coveredRequirements.includes('privacy_preserving'));
  const gPrivacy=gate('data_privacy',privacyOk?'pass':'fail',
    privacyOk?'Condições de compartilhamento sintéticas compatíveis':'Restrição obrigatória de dados não atendida');

  const coverageOk=solution.supportedSegments.includes(need.segmentCode)
    &&solution.supportedSizes.includes(need.sizeCode)
    &&solution.supportedChannels.includes(need.channelCode)
    &&solution.coverageRegionCodes.includes(DEMO_REGION_CODE)
    &&(!need.constraints.mobileRequired || details.mobileSupported)
    &&(!mandatory.includes('mobile_access') || details.mobileSupported);
  const gCoverage=gate('coverage',coverageOk?'pass':'fail',coverageOk?
    'Segmento, porte, canal, região e mobilidade atendidos na simulação':
    'Falha de território, porte, segmento, canal ou mobilidade indispensável');

  let curStatus:GateStatus;
  let curReason:string;
  if(solution.curationStatus==='expired'||solution.curationStatus==='suspended'||ISO(solution.validUntil)<ISO(evaluatedAt)){
    curStatus='fail';curReason='Ficha suspensa ou expirada: proibido recomendar';
  }else if(solution.curationStatus!=='validated_for_demo'){
    curStatus='unknown';curReason='Validação demonstrativa ainda em curadoria';
  }else if(goodEvidence.length===0){
    curStatus='unknown';curReason='Evidência simulada vigente insuficiente';
  }else{
    curStatus='pass';curReason='Validação SOMENTE SIMULADA vigente, sem evidência real';
  }
  const gCuration=gate('curation_evidence',curStatus,curReason,ev);
  const gates=[gEssential,gTechnical,gBudget,gPrivacy,gCoverage,gCuration];
  const base={
    needId:need.id,solutionId:solution.id,evaluatedAt:evaluatedAt as QualifiedNeed['createdAt'],
    rulesVersion:MATCH_RULES_VERSION,catalogVersion:solution.catalogVersion,
    gates,explanations:['Resultado gerado por gates antes do score; aprovação AC apenas simulada'],
    limitations:['Startup, preço e todas as evidências são SIMULADOS; não são validações comerciais'],
  };
  const failures=gates.filter(g=>g.status==='fail').map(g=>g.code);
  if(failures.length)return {...base,outcome:'ineligible',failedGateCodes:failures};
  const unknowns=gates.filter(g=>g.status==='unknown').map(g=>`${g.code}: ${g.reason}`);
  if(unknowns.length||solution.implantationHours===null){
    return {...base,outcome:'needs_information',missingInformation:[...unknowns,
      ...(solution.implantationHours===null?['Horas de implantação não confirmadas']:[])]};
  }
  const breakdown=scoreBreakdown(need,solution,goodEvidence.length);
  const score=Math.round(breakdown.reduce((sum,x)=>sum+x.points,0)*10)/10;
  const recommendation=score>=80?'recommended':score>=65?'conditional':'not_recommended';
  return {...base,outcome:'eligible',breakdown,score,recommendation};
}

export function evaluateCatalog(need:Need, evaluatedAt:string, catalogue:Solution[]=solutions):MatchEvaluation {
  if(need.status!=='qualified'){
    return {status:'insufficient_data',needId:need.id,missingInformation:need.missingFields,results:[]};
  }
  const results=catalogue.map(solution=>evaluateSolution(need,solution,evaluatedAt));
  const scored=results.filter((r):r is Extract<MatchResult,{outcome:'eligible'}>=>r.outcome==='eligible')
    .sort((a,b)=>b.score-a.score||a.solutionId.localeCompare(b.solutionId));
  const top=scored[0];
  if(top){
    return {status:top.recommendation==='not_recommended'?'no_recommendation':top.recommendation,
      needId:need.id,results,topSolutionId:top.solutionId};
  }
  // Qualquer candidato plausível com dados críticos ausentes impede conclusão de ausência.
  if(results.some(r=>r.outcome==='needs_information')){
    return {status:'insufficient_data',needId:need.id,
      missingInformation:['Há ficha/preço/implantação pendente de curadoria'],results};
  }
  return {status:'no_eligible_catalog_solution',needId:need.id,results};
}
