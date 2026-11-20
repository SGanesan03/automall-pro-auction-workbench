import { ActorRole, WorkflowPermission } from '../types/rbac';
import { WorkflowStepId } from '../types/workflow';
import { canWorkflow, AUCTION_ROLES } from './auctionRbac';

// Maps each step to the WorkflowPermission that gates it
export const STEP_PERMISSION_MAP: Record<WorkflowStepId, WorkflowPermission> = {
  EVENT_PLANNER:              'STEP_EVENT_PLANNER',
  CUSTOMER_REGISTRATION:      'STEP_CUSTOMER_REGISTRATION',
  BLUE_JACK_CONFIG:           'STEP_BLUE_JACK_CONFIG',
  VEHICLE_REGISTRATION:       'STEP_VEHICLE_REGISTRATION',
  INWARD_ENTRY:               'STEP_INWARD_ENTRY',
  SLA_UPLOAD:                 'STEP_SLA_UPLOAD',
  SERVICE_REGISTRATION:       'STEP_SERVICE_REGISTRATION',
  JOB_REGISTRATION:           'STEP_JOB_REGISTRATION',
  JOB_INITIATION:             'STEP_JOB_INITIATION',
  ACTIVITY_LOG:               'STEP_ACTIVITY_LOG',
  IMAGE_UPLOAD:               'STEP_IMAGE_UPLOAD',
  VEHICLE_TAGGING:            'STEP_VEHICLE_TAGGING',
  ADDITIONAL_VEHICLE_TAGGING: 'STEP_ADDITIONAL_VEHICLE_TAGGING',
  BIDDER_REGISTRATION:        'STEP_BIDDER_REGISTRATION',
  SOLD_MARK:                  'STEP_SOLD_MARK',
  MANUAL_RECEIPT:             'STEP_MANUAL_RECEIPT',
  SALE_AMOUNT_COLLECTION:     'STEP_SALE_AMOUNT_COLLECTION',
  STATEMENT_OF_SERVICES:      'STEP_STATEMENT_OF_SERVICES',
  MARK_FOR_APPROVAL:          'STEP_MARK_FOR_APPROVAL',
  CREDIT_LIMIT:               'STEP_CREDIT_LIMIT',
  RECEIPT_ENTRY_RSD:          'STEP_RECEIPT_ENTRY_RSD',
  COLLECTION_MAPPING:         'STEP_COLLECTION_MAPPING',
  FINAL_INVOICE:              'STEP_FINAL_INVOICE',
  GATE_PASS:                  'STEP_GATE_PASS',
  BUYER_RECEIPT_ENTRY:        'STEP_BUYER_RECEIPT_ENTRY',
  OUTWARD_ENTRY:              'STEP_OUTWARD_ENTRY',
  SALE_CLOSURE:               'STEP_SALE_CLOSURE',
  EVENT_DAY_CLOSURE:          'STEP_EVENT_DAY_CLOSURE',
  EVENT_CLOSURE:              'STEP_EVENT_CLOSURE',
  DEAL_AMENDMENT:             'STEP_DEAL_AMENDMENT',
  DEAL_CANCELLATION:          'STEP_DEAL_CANCELLATION',
  UNSOLD_DETAILS:             'STEP_UNSOLD_DETAILS',
  NEGOTIATED_SALE:            'STEP_NEGOTIATED_SALE',
  PRIVATE_TREATY_SALE:        'STEP_PRIVATE_TREATY_SALE',
  GROUP_MASTER:               'STEP_GROUP_MASTER',
  SQL_ROLE_MASTER:            'STEP_SQL_ROLE_MASTER',
  GROUP_TO_ROLE:              'STEP_GROUP_TO_ROLE',
  MENU_ACCESS_RIGHTS:         'STEP_MENU_ACCESS_RIGHTS',
  GROUP_USER_LINK:            'STEP_GROUP_USER_LINK',
};

// Human-readable owner label per step
export const STEP_OWNER_LABEL: Record<WorkflowStepId, { owner: string; style: string }> = {
  EVENT_PLANNER:              { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CUSTOMER_REGISTRATION:      { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  BLUE_JACK_CONFIG:           { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  VEHICLE_REGISTRATION:       { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  INWARD_ENTRY:               { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  SLA_UPLOAD:                 { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  SERVICE_REGISTRATION:       { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  JOB_REGISTRATION:           { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  JOB_INITIATION:             { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ACTIVITY_LOG:               { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  IMAGE_UPLOAD:               { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  VEHICLE_TAGGING:            { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ADDITIONAL_VEHICLE_TAGGING: { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  BIDDER_REGISTRATION:        { owner: 'Buyer',      style: 'bg-[#F5EEFA] text-[#2E054E] border-[#2E054E]/20' },
  SOLD_MARK:                  { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  MANUAL_RECEIPT:             { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  SALE_AMOUNT_COLLECTION:     { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  STATEMENT_OF_SERVICES:      { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  MARK_FOR_APPROVAL:          { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  CREDIT_LIMIT:               { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  RECEIPT_ENTRY_RSD:          { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  COLLECTION_MAPPING:         { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  FINAL_INVOICE:              { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  GATE_PASS:                  { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  BUYER_RECEIPT_ENTRY:        { owner: 'Buyer',      style: 'bg-[#F5EEFA] text-[#2E054E] border-[#2E054E]/20' },
  OUTWARD_ENTRY:              { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  SALE_CLOSURE:               { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  EVENT_DAY_CLOSURE:          { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  EVENT_CLOSURE:              { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DEAL_AMENDMENT:             { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  DEAL_CANCELLATION:          { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  UNSOLD_DETAILS:             { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  NEGOTIATED_SALE:            { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  PRIVATE_TREATY_SALE:        { owner: 'Seller',     style: 'bg-amber-50 text-amber-700 border-amber-200' },
  GROUP_MASTER:               { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  SQL_ROLE_MASTER:            { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  GROUP_TO_ROLE:              { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  MENU_ACCESS_RIGHTS:         { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  GROUP_USER_LINK:            { owner: 'Ops Admin',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export function canCompleteStep(role: ActorRole, stepId: WorkflowStepId): boolean {
  const perm = STEP_PERMISSION_MAP[stepId];
  return canWorkflow(role, perm);
}

// Returns which tabs are visible for a given role
export type WorkflowTab = 'CASES' | 'CUSTOMERS' | 'VEHICLES' | 'EVENTS' | 'BIDDERS' | 'ACCESS_CONTROL';

const TAB_PERMISSION_MAP: Record<WorkflowTab, WorkflowPermission | null> = {
  CASES:          null, // always visible
  CUSTOMERS:      'TAB_CUSTOMERS',
  VEHICLES:       'TAB_VEHICLES',
  EVENTS:         'TAB_EVENTS',
  BIDDERS:        'TAB_BIDDERS',
  ACCESS_CONTROL: 'TAB_ACCESS_CONTROL',
};

export function canViewTab(role: ActorRole, tab: WorkflowTab): boolean {
  const perm = TAB_PERMISSION_MAP[tab];
  if (!perm) return true;
  return canWorkflow(role, perm);
}

// Summary of what each role can do in the workflow — used for the access denied banner
export const ROLE_WORKFLOW_SUMMARY: Record<ActorRole, { allowed: string[]; denied: string[] }> = {
  BUYER: {
    allowed: ['View workflow cases', 'Register as bidder', 'Enter buyer receipt / facilitation fee'],
    denied:  ['Create new cases', 'Customer / Vehicle / Event management', 'Ops steps (Inward, Jobs, Tagging, Gate Pass)', 'Seller steps (Sold Mark, Invoice, Collection)', 'Access Control'],
  },
  SELLER_NBFC: {
    allowed: ['Create & manage cases', 'Customer registration', 'Vehicle registration', 'Sold Mark & bid approval', 'Manual receipt / sale collection', 'Statement of services', 'Invoice & collection mapping', 'Deal amendment / cancellation', 'Negotiated sale / private treaty'],
    denied:  ['Ops steps (Inward Entry, Job Initiation, Image Upload, Tagging, Gate Pass, Outward)', 'Access Control (SUSR)'],
  },
  OPS_ADMIN: {
    allowed: ['Full workflow access', 'All ops steps', 'All seller steps', 'Bidder registration', 'Access Control (SUSR)'],
    denied:  [],
  },
};

export { canWorkflow };
