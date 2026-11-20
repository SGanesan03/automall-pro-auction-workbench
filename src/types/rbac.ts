export type ActorRole = 'BUYER' | 'SELLER_NBFC' | 'OPS_ADMIN';

export type AuctionPermission =
  | 'VIEW_LOTS'
  | 'PLACE_BID'
  | 'VIEW_SELLER_RESERVE'
  | 'APPROVE_WINNING_BID'
  | 'UPDATE_VEHICLE_SERVICES'
  | 'VIEW_AUDIT_LOG';

// ─── Workflow Permissions ─────────────────────────────────────────────────────
export type WorkflowPermission =
  // Case management
  | 'CREATE_CASE'
  | 'VIEW_ALL_CASES'
  | 'VIEW_OWN_CASES'
  // Tabs
  | 'TAB_CUSTOMERS'
  | 'TAB_VEHICLES'
  | 'TAB_EVENTS'
  | 'TAB_BIDDERS'
  | 'TAB_ACCESS_CONTROL'
  // Ops-Admin owned steps
  | 'STEP_EVENT_PLANNER'
  | 'STEP_INWARD_ENTRY'
  | 'STEP_SLA_UPLOAD'
  | 'STEP_SERVICE_REGISTRATION'
  | 'STEP_JOB_REGISTRATION'
  | 'STEP_JOB_INITIATION'
  | 'STEP_ACTIVITY_LOG'
  | 'STEP_IMAGE_UPLOAD'
  | 'STEP_VEHICLE_TAGGING'
  | 'STEP_ADDITIONAL_VEHICLE_TAGGING'
  | 'STEP_OUTWARD_ENTRY'
  | 'STEP_GATE_PASS'
  | 'STEP_EVENT_DAY_CLOSURE'
  | 'STEP_EVENT_CLOSURE'
  | 'STEP_SALE_CLOSURE'
  | 'STEP_UNSOLD_DETAILS'
  | 'STEP_BLUE_JACK_CONFIG'
  // Seller-owned steps
  | 'STEP_CUSTOMER_REGISTRATION'
  | 'STEP_VEHICLE_REGISTRATION'
  | 'STEP_SOLD_MARK'
  | 'STEP_MANUAL_RECEIPT'
  | 'STEP_SALE_AMOUNT_COLLECTION'
  | 'STEP_STATEMENT_OF_SERVICES'
  | 'STEP_MARK_FOR_APPROVAL'
  | 'STEP_COLLECTION_MAPPING'
  | 'STEP_FINAL_INVOICE'
  | 'STEP_DEAL_AMENDMENT'
  | 'STEP_DEAL_CANCELLATION'
  | 'STEP_NEGOTIATED_SALE'
  | 'STEP_PRIVATE_TREATY_SALE'
  | 'STEP_CREDIT_LIMIT'
  | 'STEP_RECEIPT_ENTRY_RSD'
  // Buyer-owned steps
  | 'STEP_BIDDER_REGISTRATION'
  | 'STEP_BUYER_RECEIPT_ENTRY'
  // Access control (Admin only)
  | 'STEP_GROUP_MASTER'
  | 'STEP_SQL_ROLE_MASTER'
  | 'STEP_GROUP_TO_ROLE'
  | 'STEP_MENU_ACCESS_RIGHTS'
  | 'STEP_GROUP_USER_LINK';

export interface RoleDefinition {
  role: ActorRole;
  label: string;
  tagline: string;
  badgeStyle: string;
  permissions: AuctionPermission[];
  workflowPermissions: WorkflowPermission[];
}
