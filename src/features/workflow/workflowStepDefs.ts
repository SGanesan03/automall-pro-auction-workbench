import { WorkflowStepId, WorkflowType, ServiceType, PaymentFlowType, SellerCategory } from '../../types/workflow';

export interface StepDef {
  id: WorkflowStepId;
  label: string;
  description: string;
  conditional?: string;
}

const S = (id: WorkflowStepId, label: string, description: string, conditional?: string): StepDef =>
  ({ id, label, description, conditional });

export const ALL_STEP_DEFS: Record<WorkflowStepId, StepDef> = {
  EVENT_PLANNER:              S('EVENT_PLANNER',              'Event Planner',              'Create & configure auction event, set date, venue, lot capacity'),
  CUSTOMER_REGISTRATION:      S('CUSTOMER_REGISTRATION',      'Customer Registration',      'Register seller — Corporate/Retail/NBFC/Bank with GSTIN, PAN, SLA'),
  BLUE_JACK_CONFIG:           S('BLUE_JACK_CONFIG',           'Blue Jack Configuration',    'Define GST% for Industry Type if not already configured', 'Only if GST% not defined for Industry Type'),
  VEHICLE_REGISTRATION:       S('VEHICLE_REGISTRATION',       'Vehicle Registration',       'Capture chassis, engine, RC, hypothecation, odometer details'),
  INWARD_ENTRY:               S('INWARD_ENTRY',               'Inward Entry',               'Physical gate-in of vehicle into Automall yard, assign bay'),
  SLA_UPLOAD:                 S('SLA_UPLOAD',                 'SLA Upload / Download',      'Upload signed Service Level Agreement for customer', 'Only for SLA-not-uploaded customers'),
  SERVICE_REGISTRATION:       S('SERVICE_REGISTRATION',       'Service Registration',       'Select services: Auction, Parking, Documentation, Refurbishment, Towing'),
  JOB_REGISTRATION:           S('JOB_REGISTRATION',           'Job Registration',           'Create job cards for each non-auction service selected'),
  JOB_INITIATION:             S('JOB_INITIATION',             'Job Initiation',             'Assign technician, start job clock', 'Only if services other than Auction selected'),
  ACTIVITY_LOG:               S('ACTIVITY_LOG',               'Activity Log',               'Record job progress milestones and mark job completion'),
  IMAGE_UPLOAD:               S('IMAGE_UPLOAD',               'Image Upload & Sequence',    'Upload 360° vehicle photos, set display sequence for auction portal'),
  VEHICLE_TAGGING:            S('VEHICLE_TAGGING',            'Vehicle Tagging',            'Assign lot number and tag vehicle to auction event'),
  ADDITIONAL_VEHICLE_TAGGING: S('ADDITIONAL_VEHICLE_TAGGING', 'Additional Vehicle Tagging', 'Tag second/additional vehicle to same event lot'),
  BIDDER_REGISTRATION:        S('BIDDER_REGISTRATION',        'Bidder Registration',        'Register bidders, collect EMD, issue bidder cards'),
  SOLD_MARK:                  S('SOLD_MARK',                  'Sold Mark',                  'Record hammer price, winning bidder; seller approves bid'),
  MANUAL_RECEIPT:             S('MANUAL_RECEIPT',             'Manual Receipt Updation',    'Enter manual receipt for Corporate seller payment', 'For Corporate sellers'),
  SALE_AMOUNT_COLLECTION:     S('SALE_AMOUNT_COLLECTION',     'Sale Amount Collection',     'Collect sale proceeds from Retail seller', 'For Retail sellers'),
  STATEMENT_OF_SERVICES:      S('STATEMENT_OF_SERVICES',      'Statement of Services',      'Generate itemised service charges with GST breakup'),
  MARK_FOR_APPROVAL:          S('MARK_FOR_APPROVAL',          'Mark for Approval',          'Route statement for discount approval if any concession applied', 'Only if discount needed'),
  CREDIT_LIMIT:               S('CREDIT_LIMIT',               'Credit Limit (Individual)',  'Apply credit limit against seller dues', 'Credit Limit payment flow only'),
  RECEIPT_ENTRY_RSD:          S('RECEIPT_ENTRY_RSD',          'Receipt Entry (RSD)',        'Enter RSD (Refundable Security Deposit) receipt', 'RSD payment flow only'),
  COLLECTION_MAPPING:         S('COLLECTION_MAPPING',         'Collection Mapping',         'Map receipts to invoice line items, reconcile payments'),
  FINAL_INVOICE:              S('FINAL_INVOICE',              'Final Invoice',              'Generate and lock final tax invoice'),
  GATE_PASS:                  S('GATE_PASS',                  'Gate Pass',                  'Issue gate pass after buyer dues settlement (auto-adjust or manual receipt)'),
  BUYER_RECEIPT_ENTRY:        S('BUYER_RECEIPT_ENTRY',        'Buyer Receipt Entry',        'Enter facilitation fee receipt for manual gate pass', 'Only if Manual Receipt gate pass'),
  OUTWARD_ENTRY:              S('OUTWARD_ENTRY',              'Outward Entry',              'Record vehicle exit from yard — driver, transport vehicle details'),
  SALE_CLOSURE:               S('SALE_CLOSURE',               'Sale Closure',               'Close non-inward vehicle sale record'),
  EVENT_DAY_CLOSURE:          S('EVENT_DAY_CLOSURE',          'Event Day Closure',          'Close bidding for the day, freeze lot results'),
  EVENT_CLOSURE:              S('EVENT_CLOSURE',              'Event Closure',              'Final closure of auction event'),
  DEAL_AMENDMENT:             S('DEAL_AMENDMENT',             'Deal Amendment',             'Amend hammer price, buyer, or terms post sold-mark approval'),
  DEAL_CANCELLATION:          S('DEAL_CANCELLATION',          'Deal Cancellation',          'Cancel approved deal, apply penalty, revert lot to unsold'),
  UNSOLD_DETAILS:             S('UNSOLD_DETAILS',             'Unsold Details Updation',    'Record unsold lot details after event day closure'),
  NEGOTIATED_SALE:            S('NEGOTIATED_SALE',            'Negotiated Sale',            'Direct negotiated sale below reserve after unsold updation'),
  PRIVATE_TREATY_SALE:        S('PRIVATE_TREATY_SALE',        'Private Treaty Sale',        'Off-auction direct sale between seller and buyer'),
  GROUP_MASTER:               S('GROUP_MASTER',               'Group Master',               'Create user groups for SUSR access control'),
  SQL_ROLE_MASTER:            S('SQL_ROLE_MASTER',            'SQL Role Master',            'Define SQL-level roles and privileges'),
  GROUP_TO_ROLE:              S('GROUP_TO_ROLE',              'Group To Role',              'Map groups to SQL roles'),
  MENU_ACCESS_RIGHTS:         S('MENU_ACCESS_RIGHTS',         'Menu Access Rights',         'Configure screen-level view/create/edit/delete permissions per group'),
  GROUP_USER_LINK:            S('GROUP_USER_LINK',            'Group User Link',            'Link SUSR login users to groups'),
};

export const WORKFLOW_FLOWS: Record<WorkflowType, WorkflowStepId[]> = {
  INWARD_VEHICLE: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'COLLECTION_MAPPING','FINAL_INVOICE','GATE_PASS','OUTWARD_ENTRY',
  ],
  NON_INWARD_VEHICLE: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'COLLECTION_MAPPING','FINAL_INVOICE','SALE_CLOSURE',
  ],
  INWARD_SECOND_VEHICLE: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','ADDITIONAL_VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'COLLECTION_MAPPING','FINAL_INVOICE','GATE_PASS','OUTWARD_ENTRY',
  ],
  SLA_NOT_UPLOADED: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','SLA_UPLOAD','JOB_REGISTRATION','JOB_INITIATION',
    'ACTIVITY_LOG','IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'COLLECTION_MAPPING','FINAL_INVOICE','GATE_PASS','OUTWARD_ENTRY',
  ],
  INWARD_BLUE_JACK: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','BLUE_JACK_CONFIG','VEHICLE_REGISTRATION',
    'INWARD_ENTRY','SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION',
    'ACTIVITY_LOG','IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'COLLECTION_MAPPING','FINAL_INVOICE','GATE_PASS','OUTWARD_ENTRY',
  ],
  NON_INWARD_BLUE_JACK: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','BLUE_JACK_CONFIG','VEHICLE_REGISTRATION',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'COLLECTION_MAPPING','FINAL_INVOICE','SALE_CLOSURE',
  ],
  // Fix #13: MANUAL_RECEIPT + STATEMENT_OF_SERVICES added before EVENT_DAY_CLOSURE per spec
  DEAL_AMENDMENT: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES',
    'EVENT_DAY_CLOSURE','DEAL_AMENDMENT',
  ],
  DEAL_CANCELLATION: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES',
    'EVENT_DAY_CLOSURE','EVENT_CLOSURE','DEAL_CANCELLATION',
  ],
  NEGOTIATED_SALE: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','VEHICLE_TAGGING','EVENT_DAY_CLOSURE','UNSOLD_DETAILS',
    'NEGOTIATED_SALE','MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'COLLECTION_MAPPING','FINAL_INVOICE','GATE_PASS','OUTWARD_ENTRY',
  ],
  PRIVATE_TREATY: [
    'CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','PRIVATE_TREATY_SALE',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'COLLECTION_MAPPING','FINAL_INVOICE','GATE_PASS','OUTWARD_ENTRY',
  ],
};

export const SERVICE_FLOWS: Record<ServiceType, WorkflowStepId[]> = {
  PARKING: [
    'CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY','ACTIVITY_LOG',
    'STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL','COLLECTION_MAPPING','FINAL_INVOICE',
    'GATE_PASS','OUTWARD_ENTRY',
  ],
  DOCUMENTATION: [
    'CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL','COLLECTION_MAPPING','FINAL_INVOICE',
    'GATE_PASS','OUTWARD_ENTRY',
  ],
  REFURBISHMENT: [
    'CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL','COLLECTION_MAPPING','FINAL_INVOICE',
    'GATE_PASS','OUTWARD_ENTRY',
  ],
  TOWING: [
    'CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL','COLLECTION_MAPPING','FINAL_INVOICE',
    'GATE_PASS','OUTWARD_ENTRY',
  ],
  AUCTION: [
    'CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY','EVENT_PLANNER',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'COLLECTION_MAPPING','FINAL_INVOICE','GATE_PASS','OUTWARD_ENTRY',
  ],
};

// Fix #12: Payment flows 6, 7, 8 from spec
export const PAYMENT_FLOWS: Record<PaymentFlowType, WorkflowStepId[]> = {
  CREDIT_LIMIT_SELLER: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'CREDIT_LIMIT','COLLECTION_MAPPING','FINAL_INVOICE','GATE_PASS','OUTWARD_ENTRY',
  ],
  RSD_PAYMENT_SELLER: [
    'EVENT_PLANNER','CUSTOMER_REGISTRATION','VEHICLE_REGISTRATION','INWARD_ENTRY',
    'SERVICE_REGISTRATION','JOB_REGISTRATION','JOB_INITIATION','ACTIVITY_LOG',
    'IMAGE_UPLOAD','VEHICLE_TAGGING','BIDDER_REGISTRATION','SOLD_MARK',
    'MANUAL_RECEIPT','STATEMENT_OF_SERVICES','MARK_FOR_APPROVAL',
    'RECEIPT_ENTRY_RSD','COLLECTION_MAPPING','FINAL_INVOICE','GATE_PASS','OUTWARD_ENTRY',
  ],
  GROUP_USER_LINK: [
    'GROUP_MASTER','SQL_ROLE_MASTER','GROUP_TO_ROLE','MENU_ACCESS_RIGHTS','GROUP_USER_LINK',
  ],
};

// Fix #16: Swap MANUAL_RECEIPT <-> SALE_AMOUNT_COLLECTION based on seller category
export function resolvePaymentStep(
  stepId: WorkflowStepId,
  sellerCategory: SellerCategory
): WorkflowStepId {
  if (stepId === 'MANUAL_RECEIPT' && sellerCategory === 'RETAIL') return 'SALE_AMOUNT_COLLECTION';
  if (stepId === 'SALE_AMOUNT_COLLECTION' && sellerCategory === 'CORPORATE') return 'MANUAL_RECEIPT';
  return stepId;
}
