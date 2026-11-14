/** Casos extraídos do contrato AG-01: A é separado das quatro seeds B; C apenas local. */
import type { NeedDraft, QualifiedNeed, Requirement, RequirementCode, UUID } from '../src/domain/types';
const now='2026-11-14T12:00:00Z' as QualifiedNeed['createdAt'];
function req(id:UUID,code:RequirementCode,kind:Requirement['kind']='mandatory',priority:Requirement['priority']=1):Requirement {
  return {id:`req:${id}:${code}`,code,kind,priority,description:code,acceptanceCriterion:`Confirmar ${code}`,evidence:'simulated'};
}
export const scenarioA:QualifiedNeed = {
  id:'a0a11000-0000-4000-8000-000000000001' as UUID,
  schemaVersion:1,origin:'scenario_fixture',createdAt:now,status:'qualified',isDemo:true,
  associationCode:'ac_alfa',segmentCode:'stationery',sizeCode:'small',channelCode:'whatsapp',
  painCode:'stock_confirmation_delay',processCode:'erp_lookup',frequencyCode:'daily',
  hasErp:true,erpCode:'erp_x',problemSummary:'A confirmação manual de estoque atrasa respostas a pedidos.',
  requirements:[],
  constraints:{budgetBand:'medium',dataSharing:'restricted',mobileRequired:false,offlineRequired:false,trainingMaxHours:4},
  metric:{code:'confirmation_minutes',baseline:7,target:2},demoClusterKey:'stock_confirmation_delay|digital|erp|whatsapp',
};
scenarioA.requirements=[req(scenarioA.id,'stock_lookup'),req(scenarioA.id,'multi_store')];
export const scenarioB:QualifiedNeed = {
  ...scenarioA,
  id:'e0a11000-0000-4000-8000-000000000001' as UUID,
  origin:'seed',sizeCode:'micro',processCode:'spreadsheet_check',
  hasErp:false,erpCode:null,
  requirements:[],
  constraints:{budgetBand:'low',dataSharing:'restricted',mobileRequired:true,offlineRequired:false,trainingMaxHours:2},
  demoClusterKey:'stock_confirmation_delay|manual|no_erp|whatsapp',
};
scenarioB.requirements=[req(scenarioB.id,'stock_lookup'),req(scenarioB.id,'no_erp_dependency')];
export const scenarioC:NeedDraft = {
  id:'c0a11000-0000-4000-8000-000000000001' as UUID,
  schemaVersion:1,status:'insufficient_data',localOnly:true,isDemo:true,
  fields:{associationCode:'ac_alfa',segmentCode:'gifts',sizeCode:'micro',channelCode:'whatsapp',
    painCode:'stock_confirmation_delay',processCode:'manual_message',frequencyCode:'daily',
    problemSummary:'A confirmação manual de estoque atrasa respostas a pedidos.'},
  missingFields:['hasErp','erpCode','requirements','constraints','metric'],
};
export const scenarioD:QualifiedNeed = {
  ...scenarioA,
  id:'d0a11000-0000-4000-8000-000000000001' as UUID,
  segmentCode:'fashion',painCode:'customer_follow_up',processCode:'manual_message',
  sizeCode:'small',hasErp:false,erpCode:null,
  problemSummary:'Retornos comerciais a clientes são esquecidos na rotina.',
  constraints:{budgetBand:'medium',dataSharing:'restricted',mobileRequired:true,offlineRequired:false,trainingMaxHours:4},
  metric:{code:'hours_per_week',baseline:8,target:3},
  requirements:[],demoClusterKey:'customer_follow_up|manual|no_erp|whatsapp',
};
scenarioD.requirements=[
  req(scenarioD.id,'whatsapp_workflow'), req(scenarioD.id,'privacy_preserving'),
  req(scenarioD.id,'mobile_access','optional',2),req(scenarioD.id,'short_training','optional',2),
];
export const scenarioE:QualifiedNeed = {
  ...scenarioA,id:'e0a12000-0000-4000-8000-000000000001' as UUID,
  painCode:'sales_reconciliation',segmentCode:'grocery',channelCode:'counter',processCode:'visual_check',
  hasErp:false,erpCode:null,sizeCode:'micro',requirements:[],
  constraints:{budgetBand:'low',dataSharing:'restricted',mobileRequired:false,offlineRequired:false,trainingMaxHours:3},
  demoClusterKey:'sales_reconciliation|manual|no_erp|counter',
};
scenarioE.requirements=[req(scenarioE.id,'privacy_preserving')];
