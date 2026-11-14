/**
 * AG-06 — quatro relatos INDEPENDENTES e 100% FICTÍCIOS, pertencentes ao bundle.
 * Não inserir no Supabase. IDs estáveis; cenários A/C/D/E são externos a este array.
 * Nenhum registro representa lojista real ou comprovação de recorrência de mercado.
 */
import { SCHEMA_VERSION } from '../domain/types';
import type {
  AssociationCode, ChannelCode, ISODateTime, ProcessCode, QualifiedNeed,
  Requirement, RequirementCode, SegmentCode, SizeCode, UUID,
} from '../domain/types';
import { deriveDemoClusterKey, makeDemoRequirement, PAIN_TEMPLATES } from './registries';

const date = (iso:string):ISODateTime => iso as ISODateTime;
const uuid = (id:string):UUID => id as UUID;

type SeedSpec = {
  id:string; createdAt:string; associationCode:AssociationCode; segmentCode:SegmentCode;
  sizeCode:SizeCode; processCode:ProcessCode; channelCode:ChannelCode;
  mandatory:RequirementCode[]; optional:RequirementCode[];
  budgetBand:'low'|'medium'; dataSharing:'restricted'; trainingMaxHours:1|2|3;
  mobileRequired:boolean;
};

function buildSeed(s:SeedSpec):QualifiedNeed {
  const id=uuid(s.id);
  const mk=(codes:RequirementCode[],kind:Requirement['kind'])=>
    codes.map(code=>makeDemoRequirement(id,code,kind));
  return {
    id, schemaVersion:SCHEMA_VERSION, origin:'seed', createdAt:date(s.createdAt),
    status:'qualified', isDemo:true, associationCode:s.associationCode,
    segmentCode:s.segmentCode, sizeCode:s.sizeCode, channelCode:s.channelCode,
    painCode:'stock_confirmation_delay', processCode:s.processCode,
    frequencyCode:'daily', hasErp:false, erpCode:null,
    problemSummary:PAIN_TEMPLATES.stock_confirmation_delay,
    requirements:[...mk(s.mandatory,'mandatory'),...mk(s.optional,'optional')],
    constraints:{budgetBand:s.budgetBand,dataSharing:s.dataSharing,
      mobileRequired:s.mobileRequired,offlineRequired:false,trainingMaxHours:s.trainingMaxHours},
    metric:{code:'confirmation_minutes',baseline:7,target:2},
    demoClusterKey:deriveDemoClusterKey('stock_confirmation_delay',s.processCode,false,s.channelCode),
  };
}

export const seedDemands: QualifiedNeed[] = [
  // L-001 | Papelaria Alfa: consulta em planilha para cerca de 850 SKUs (contexto fictício no handoff).
  buildSeed({id:'e0a11000-0000-4000-8000-000000000001',createdAt:'2026-11-14T12:10:00Z',
    associationCode:'ac_alfa',segmentCode:'stationery',sizeCode:'micro',
    processCode:'spreadsheet_check',channelCode:'whatsapp',
    mandatory:['stock_lookup','no_erp_dependency','whatsapp_workflow','mobile_access'],
    optional:['manual_stock_update','short_training'],budgetBand:'low',dataSharing:'restricted',
    trainingMaxHours:2,mobileRequired:true}),
  // L-002 | Moda Alfa: verificação visual de grades de tamanhos; treinamento máximo 1h.
  buildSeed({id:'e0a11000-0000-4000-8000-000000000002',createdAt:'2026-11-14T12:11:00Z',
    associationCode:'ac_alfa',segmentCode:'fashion',sizeCode:'micro',
    processCode:'visual_check',channelCode:'whatsapp',
    mandatory:['stock_lookup','no_erp_dependency','whatsapp_workflow','mobile_access','short_training'],
    optional:['manual_stock_update'],budgetBand:'low',dataSharing:'restricted',
    trainingMaxHours:1,mobileRequired:true}),
  // L-003 | Utilidades Beta: confirmação entre duas unidades via mensagens internas.
  buildSeed({id:'e0a11000-0000-4000-8000-000000000003',createdAt:'2026-11-14T12:12:00Z',
    associationCode:'ac_beta',segmentCode:'housewares',sizeCode:'small',
    processCode:'manual_message',channelCode:'whatsapp',
    mandatory:['stock_lookup','no_erp_dependency','whatsapp_workflow','multi_store','mobile_access'],
    optional:['short_training'],budgetBand:'medium',dataSharing:'restricted',
    trainingMaxHours:3,mobileRequired:true}),
  // L-004 | Presentes Beta: controle em planilha de itens sazonais; uso móvel desejável.
  buildSeed({id:'e0a11000-0000-4000-8000-000000000004',createdAt:'2026-11-14T12:13:00Z',
    associationCode:'ac_beta',segmentCode:'gifts',sizeCode:'micro',
    processCode:'spreadsheet_check',channelCode:'whatsapp',
    mandatory:['stock_lookup','no_erp_dependency','whatsapp_workflow'],
    optional:['mobile_access','manual_stock_update','short_training'],
    budgetBand:'low',dataSharing:'restricted',trainingMaxHours:2,mobileRequired:false}),
];
/** Compatibilidade semântica com consumidores que usam o termo Need. */
export const seedNeeds = seedDemands;

/** Metadados apenas de narrativa: NÃO persistir como campos inventados de QualifiedNeed. */
export const seedDemoNarrative: Readonly<Record<string, {
  storeCode:string; context:string; bottleneck:string;
}>> = {
  'e0a11000-0000-4000-8000-000000000001':{storeCode:'L-001',
    context:'Papelaria de uma unidade; ~850 SKUs fictícios; planilha revisada duas vezes ao dia',
    bottleneck:'Localizar item na planilha durante respostas por WhatsApp'},
  'e0a11000-0000-4000-8000-000000000002':{storeCode:'L-002',
    context:'Moda de uma unidade; ~320 SKUs fictícios, com variação de tamanho e cor',
    bottleneck:'Conferir fisicamente araras e grade antes de confirmar disponibilidade'},
  'e0a11000-0000-4000-8000-000000000003':{storeCode:'L-003',
    context:'Utilidades com duas unidades; ~1.400 SKUs fictícios distribuídos',
    bottleneck:'Troca de mensagens com outro atendente para confirmar estoque por filial'},
  'e0a11000-0000-4000-8000-000000000004':{storeCode:'L-004',
    context:'Presentes de uma unidade; ~600 SKUs fictícios com picos sazonais',
    bottleneck:'Planilha desatualizada em períodos de reposição e sazonalidade'},
};
