/** Casos demonstrativos AG-06: NÃO fazem parte das quatro seeds e NÃO vão ao banco. */
import { SCHEMA_VERSION } from '../../domain/types';
import type { ISODateTime, NeedDraft, QualifiedNeed, UUID } from '../../domain/types';
import {deriveDemoClusterKey,makeDemoRequirement,PAIN_TEMPLATES} from '../registries';
const asUuid=(s:string)=>s as UUID;
const at='2026-11-14T12:00:00Z' as ISODateTime;

export const demoScenarioA:QualifiedNeed=(()=>{
  const id=asUuid('a0a11000-0000-4000-8000-000000000001');
  return {
    id,schemaVersion:SCHEMA_VERSION,origin:'scenario_fixture',createdAt:at,status:'qualified',isDemo:true,
    associationCode:'ac_alfa',segmentCode:'stationery',sizeCode:'small',channelCode:'whatsapp',
    painCode:'stock_confirmation_delay',processCode:'erp_lookup',frequencyCode:'daily',
    hasErp:true,erpCode:'erp_x',problemSummary:PAIN_TEMPLATES.stock_confirmation_delay,
    requirements:[
      makeDemoRequirement(id,'stock_lookup','mandatory'),
      makeDemoRequirement(id,'multi_store','mandatory'),
    ],
    constraints:{budgetBand:'medium',dataSharing:'restricted',mobileRequired:false,
      offlineRequired:false,trainingMaxHours:4},
    metric:{code:'confirmation_minutes',baseline:7,target:2},
    demoClusterKey:deriveDemoClusterKey('stock_confirmation_delay','erp_lookup',true,'whatsapp'),
  };
})();

export const demoScenarioC:NeedDraft={
  id:asUuid('c0a11000-0000-4000-8000-000000000001'),schemaVersion:SCHEMA_VERSION,
  status:'insufficient_data',localOnly:true,isDemo:true,
  fields:{associationCode:'ac_alfa',segmentCode:'gifts',sizeCode:'micro',channelCode:'whatsapp',
    painCode:'stock_confirmation_delay',processCode:'manual_message',frequencyCode:'daily',
    problemSummary:PAIN_TEMPLATES.stock_confirmation_delay},
  missingFields:['hasErp','erpCode','requirements','constraints','metric'],
};
