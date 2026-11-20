// ─── Workflow Domain Types ────────────────────────────────────────────────────

export type WorkflowType =
  | 'INWARD_VEHICLE'
  | 'NON_INWARD_VEHICLE'
  | 'INWARD_SECOND_VEHICLE'
  | 'SLA_NOT_UPLOADED'
  | 'INWARD_BLUE_JACK'
  | 'NON_INWARD_BLUE_JACK'
  | 'DEAL_AMENDMENT'
  | 'DEAL_CANCELLATION'
  | 'NEGOTIATED_SALE'
  | 'PRIVATE_TREATY';

export type ServiceType =
  | 'PARKING'
  | 'DOCUMENTATION'
  | 'REFURBISHMENT'
  | 'TOWING'
  | 'AUCTION';

export type PaymentFlowType =
  | 'CREDIT_LIMIT_SELLER'
  | 'RSD_PAYMENT_SELLER'
  | 'GROUP_USER_LINK';

export type SellerCategory = 'CORPORATE' | 'RETAIL';

export type WorkflowStepId =
  | 'EVENT_PLANNER'
  | 'CUSTOMER_REGISTRATION'
  | 'BLUE_JACK_CONFIG'
  | 'VEHICLE_REGISTRATION'
  | 'INWARD_ENTRY'
  | 'SLA_UPLOAD'
  | 'SERVICE_REGISTRATION'
  | 'JOB_REGISTRATION'
  | 'JOB_INITIATION'
  | 'ACTIVITY_LOG'
  | 'IMAGE_UPLOAD'
  | 'VEHICLE_TAGGING'
  | 'ADDITIONAL_VEHICLE_TAGGING'
  | 'BIDDER_REGISTRATION'
  | 'SOLD_MARK'
  | 'MANUAL_RECEIPT'
  | 'SALE_AMOUNT_COLLECTION'
  | 'STATEMENT_OF_SERVICES'
  | 'MARK_FOR_APPROVAL'
  | 'CREDIT_LIMIT'
  | 'RECEIPT_ENTRY_RSD'
  | 'COLLECTION_MAPPING'
  | 'FINAL_INVOICE'
  | 'GATE_PASS'
  | 'BUYER_RECEIPT_ENTRY'
  | 'OUTWARD_ENTRY'
  | 'SALE_CLOSURE'
  | 'EVENT_DAY_CLOSURE'
  | 'EVENT_CLOSURE'
  | 'DEAL_AMENDMENT'
  | 'DEAL_CANCELLATION'
  | 'UNSOLD_DETAILS'
  | 'NEGOTIATED_SALE'
  | 'PRIVATE_TREATY_SALE'
  | 'GROUP_MASTER'
  | 'SQL_ROLE_MASTER'
  | 'GROUP_TO_ROLE'
  | 'MENU_ACCESS_RIGHTS'
  | 'GROUP_USER_LINK';

export type StepStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

export interface WorkflowStep {
  id: WorkflowStepId;
  label: string;
  status: StepStatus;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

// ─── Customer ────────────────────────────────────────────────────────────────
export type CustomerType = 'CORPORATE' | 'RETAIL' | 'NBFC' | 'BANK';

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  type: CustomerType;
  gstin: string;
  pan: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  slaUploaded: boolean;
  creditLimit: number;
  creditUsed: number;
  industryType: string;
  blueJackGstPct?: number;
  createdAt: string;
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────
export type VehicleCondition = 'RUNNING' | 'NON_RUNNING' | 'ACCIDENT';

export interface Vehicle {
  id: string;
  vehicleId: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  registrationNo: string;
  chassisNo: string;
  engineNo: string;
  color: string;
  fuelType: string;
  odometerKm: number;
  condition: VehicleCondition;
  hypothecation: string;
  rcStatus: 'CLEAR' | 'HYPOTHECATED' | 'DISPUTED';
  isInward: boolean;
  inwardDate?: string;
  yardLocation?: string;
  createdAt: string;
}

// ─── Event ───────────────────────────────────────────────────────────────────
export type EventStatus = 'PLANNED' | 'ACTIVE' | 'DAY_CLOSED' | 'CLOSED';

export interface AuctionEvent {
  id: string;
  eventCode: string;
  eventName: string;
  eventDate: string;
  venue: string;
  city: string;
  status: EventStatus;
  totalLots: number;
  soldLots: number;
  unsoldLots: number;
  totalSaleValue: number;
  createdBy: string;
  createdAt: string;
}

// ─── Service Registration ────────────────────────────────────────────────────
export type ServiceMode = 'ADD' | 'EDIT';

export interface ServiceRegistration {
  id: string;
  vehicleId: string;
  customerId: string;
  eventId?: string;
  mode: ServiceMode;
  services: ServiceType[];
  auctionReservePrice?: number;
  parkingCharges?: number;
  refurbishmentScope?: string;
  documentationScope?: string;
  towingFrom?: string;
  towingTo?: string;
  registeredAt: string;
}

// ─── Job ─────────────────────────────────────────────────────────────────────
export type JobStatus = 'REGISTERED' | 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Job {
  id: string;
  jobNo: string;
  vehicleId: string;
  serviceId: string;
  serviceType: ServiceType;
  assignedTo: string;
  status: JobStatus;
  startedAt?: string;
  completedAt?: string;
  remarks?: string;
}

// ─── Activity Log ────────────────────────────────────────────────────────────
export interface ActivityLogEntry {
  id: string;
  jobId: string;
  vehicleId: string;
  activity: string;
  performedBy: string;
  timestamp: string;
  isJobComplete: boolean;
}

// ─── Image Upload ────────────────────────────────────────────────────────────
export interface VehicleImage {
  id: string;
  vehicleId: string;
  url: string;
  angle: string;
  sequence: number;
  uploadedAt: string;
}

// ─── Vehicle Tagging ─────────────────────────────────────────────────────────
export interface VehicleTag {
  id: string;
  vehicleId: string;
  eventId: string;
  lotNo: string;
  tagType: 'PRIMARY' | 'ADDITIONAL';
  taggedAt: string;
  taggedBy: string;
}

// ─── Bidder Registration ─────────────────────────────────────────────────────
export interface Bidder {
  id: string;
  bidderId: string;
  name: string;
  mobile: string;
  emdAmount: number;
  emdReceiptNo: string;
  eventId: string;
  registeredAt: string;
  isActive: boolean;
}

// ─── Sold Mark ───────────────────────────────────────────────────────────────
export type SoldMarkStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SoldMark {
  id: string;
  vehicleId: string;
  eventId: string;
  bidderId: string;
  bidderName: string;
  hammerPrice: number;
  status: SoldMarkStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

// ─── Statement of Services ───────────────────────────────────────────────────
export interface ServiceCharge {
  serviceType: ServiceType | string;
  description: string;
  amount: number;
  gstPct: number;
  gstAmount: number;
  total: number;
  discountApplied: number;
}

export interface StatementOfServices {
  id: string;
  vehicleId: string;
  customerId: string;
  charges: ServiceCharge[];
  subTotal: number;
  totalDiscount: number;
  totalGst: number;
  grandTotal: number;
  approvalRequired: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  generatedAt: string;
}

// ─── Invoice ─────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'DRAFT' | 'FINAL' | 'CANCELLED';

export interface Invoice {
  id: string;
  invoiceNo: string;
  vehicleId: string;
  customerId: string;
  statementId: string;
  collectionMappings: CollectionMapping[];
  totalAmount: number;
  totalCollected: number;
  balance: number;
  status: InvoiceStatus;
  generatedAt: string;
}

// ─── Collection Mapping ───────────────────────────────────────────────────────
export type PaymentMode = 'CASH' | 'CHEQUE' | 'NEFT' | 'RTGS' | 'UPI' | 'CREDIT_LIMIT' | 'RSD';

export interface CollectionMapping {
  id: string;
  receiptNo: string;
  paymentMode: PaymentMode;
  amount: number;
  bankRef?: string;
  collectedAt: string;
}

// ─── Gate Pass ───────────────────────────────────────────────────────────────
export type GatePassType = 'AUTO_ADJUST' | 'MANUAL_RECEIPT';

export interface GatePass {
  id: string;
  gatePassNo: string;
  vehicleId: string;
  invoiceId: string;
  buyerDues: number;
  adjustmentType: GatePassType;
  facilitationFee?: number;
  buyerReceiptNo?: string;
  issuedAt: string;
  issuedBy: string;
}

// ─── Outward Entry ────────────────────────────────────────────────────────────
export interface OutwardEntry {
  id: string;
  vehicleId: string;
  gatePassId: string;
  outwardDate: string;
  driverName: string;
  driverMobile: string;
  vehicleNo: string;
  remarks?: string;
  recordedBy: string;
}

// ─── Deal Amendment / Cancellation ───────────────────────────────────────────
export interface DealAmendment {
  id: string;
  vehicleId: string;
  soldMarkId: string;
  amendmentType: 'PRICE_CHANGE' | 'BUYER_CHANGE' | 'TERMS_CHANGE';
  originalValue: string;
  amendedValue: string;
  reason: string;
  amendedBy: string;
  amendedAt: string;
}

export interface DealCancellation {
  id: string;
  vehicleId: string;
  soldMarkId: string;
  reason: string;
  cancelledBy: string;
  cancelledAt: string;
  penaltyApplied: number;
}

// ─── Negotiated Sale ─────────────────────────────────────────────────────────
export interface NegotiatedSale {
  id: string;
  vehicleId: string;
  eventId: string;
  buyerName: string;
  negotiatedPrice: number;
  originalReserve: number;
  approvedBy: string;
  approvedAt: string;
}

// ─── Private Treaty ───────────────────────────────────────────────────────────
export interface PrivateTreaty {
  id: string;
  vehicleId: string;
  customerId: string;
  buyerName: string;
  salePrice: number;
  terms: string;
  executedAt: string;
}

// ─── SUSR / Access Control ────────────────────────────────────────────────────
export interface GroupMaster {
  id: string;
  groupCode: string;
  groupName: string;
  description: string;
  isActive: boolean;
}

export interface SqlRoleMaster {
  id: string;
  roleCode: string;
  roleName: string;
  description: string;
}

export interface GroupToRole {
  groupId: string;
  roleId: string;
  assignedAt: string;
}

export interface MenuAccessRight {
  groupId: string;
  menuCode: string;
  menuLabel: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface GroupUserLink {
  userId: string;
  userName: string;
  groupId: string;
  linkedAt: string;
  isActive: boolean;
}

// ─── Workflow Case (top-level entity) ────────────────────────────────────────
export interface WorkflowCase {
  id: string;
  caseNo: string;
  workflowType: WorkflowType;
  serviceType?: ServiceType;
  paymentFlow?: PaymentFlowType;
  sellerCategory: SellerCategory;
  customerId?: string;
  vehicleId?: string;
  eventId?: string;
  steps: WorkflowStep[];
  currentStepId: WorkflowStepId;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}
