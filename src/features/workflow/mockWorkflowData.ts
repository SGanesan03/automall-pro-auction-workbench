import {
  Customer, Vehicle, AuctionEvent, Bidder, WorkflowCase,
} from '../../types/workflow';
import { WORKFLOW_FLOWS } from './workflowStepDefs';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001', customerId: 'CUS2024001', name: 'HDFC Bank Ltd', type: 'BANK',
    gstin: '33AAAAH0209R1ZQ', pan: 'AAAAH0209R', contactPerson: 'Ramesh Kumar',
    mobile: '9840012345', email: 'ramesh.kumar@hdfc.com', address: '115, Anna Salai',
    city: 'Chennai', state: 'Tamil Nadu', slaUploaded: true,
    creditLimit: 5000000, creditUsed: 1200000, industryType: 'BANKING',
    createdAt: '2024-01-10T09:00:00',
  },
  {
    id: 'CUST-002', customerId: 'CUS2024002', name: 'Sundaram Finance Ltd', type: 'NBFC',
    gstin: '33AABCS1234F1ZP', pan: 'AABCS1234F', contactPerson: 'Priya Venkat',
    mobile: '9841023456', email: 'priya.v@sundaramfinance.in', address: '21, Whites Road',
    city: 'Chennai', state: 'Tamil Nadu', slaUploaded: false,
    creditLimit: 3000000, creditUsed: 800000, industryType: 'NBFC',
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: 'CUST-003', customerId: 'CUS2024003', name: 'Rajan Auto Dealers', type: 'RETAIL',
    gstin: '33AABCR5678G1ZK', pan: 'AABCR5678G', contactPerson: 'Rajan Pillai',
    mobile: '9842034567', email: 'rajan@rajanauto.com', address: '45, GST Road',
    city: 'Chennai', state: 'Tamil Nadu', slaUploaded: true,
    creditLimit: 500000, creditUsed: 0, industryType: 'AUTOMOBILE_DEALER',
    blueJackGstPct: 18,
    createdAt: '2024-02-01T11:00:00',
  },
  {
    id: 'CUST-004', customerId: 'CUS2024004', name: 'Axis Bank Fleet Division', type: 'CORPORATE',
    gstin: '29AAAAA0000A1Z5', pan: 'AAAAA0000A', contactPerson: 'Suresh Nair',
    mobile: '9880045678', email: 'suresh.nair@axisbank.com', address: '1, MG Road',
    city: 'Bengaluru', state: 'Karnataka', slaUploaded: true,
    creditLimit: 10000000, creditUsed: 2500000, industryType: 'BANKING',
    createdAt: '2024-02-10T09:30:00',
  },
];

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'VEH-001', vehicleId: 'VH2024001', customerId: 'CUST-001',
    make: 'Hyundai', model: 'Creta SX 1.5 CRDi', year: 2021,
    registrationNo: 'TN09BQ1234', chassisNo: 'MALA851BLMH123456', engineNo: 'G4FGKH123456',
    color: 'Phantom Black', fuelType: 'Diesel', odometerKm: 42500,
    condition: 'RUNNING', hypothecation: 'HDFC Bank Ltd', rcStatus: 'HYPOTHECATED',
    isInward: true, inwardDate: '2024-03-01', yardLocation: 'Bay A-12, Poonamallee Automall',
    createdAt: '2024-02-28T14:00:00',
  },
  {
    id: 'VEH-002', vehicleId: 'VH2024002', customerId: 'CUST-002',
    make: 'Maruti Suzuki', model: 'Baleno Alpha AMT', year: 2020,
    registrationNo: 'TN09BQ5678', chassisNo: 'MA3EWDE1S00234567', engineNo: 'K12MN234567',
    color: 'Pearl Arctic White', fuelType: 'Petrol', odometerKm: 38200,
    condition: 'RUNNING', hypothecation: 'Sundaram Finance', rcStatus: 'HYPOTHECATED',
    isInward: false, createdAt: '2024-03-05T10:00:00',
  },
  {
    id: 'VEH-003', vehicleId: 'VH2024003', customerId: 'CUST-003',
    make: 'Tata', model: 'Nexon XZ+ Diesel', year: 2022,
    registrationNo: 'TN37BQ9012', chassisNo: 'MAT607251NKA34567', engineNo: 'REVOTORQ34567',
    color: 'Calgary White', fuelType: 'Diesel', odometerKm: 28000,
    condition: 'RUNNING', hypothecation: 'None', rcStatus: 'CLEAR',
    isInward: true, inwardDate: '2024-03-10', yardLocation: 'Bay C-04, Neelambur Automall',
    createdAt: '2024-03-09T09:00:00',
  },
  {
    id: 'VEH-004', vehicleId: 'VH2024004', customerId: 'CUST-004',
    make: 'Mahindra', model: 'XUV700 AX5 Diesel', year: 2022,
    registrationNo: 'KA51BQ3456', chassisNo: 'MA1WGM2HXNM456789', engineNo: 'mHAWK456789',
    color: 'Dazzling Silver', fuelType: 'Diesel', odometerKm: 55000,
    condition: 'RUNNING', hypothecation: 'Axis Bank', rcStatus: 'HYPOTHECATED',
    isInward: true, inwardDate: '2024-03-12', yardLocation: 'Bay B-07, Nelamangala Automall',
    createdAt: '2024-03-11T11:00:00',
  },
];

export const MOCK_EVENTS: AuctionEvent[] = [
  {
    id: 'EVT-001', eventCode: 'SAMIL-CHN-MAR24-01', eventName: 'Chennai March Mega Auction 2024',
    eventDate: '2024-03-20', venue: 'Poonamallee Automall Yard', city: 'Chennai',
    status: 'ACTIVE', totalLots: 45, soldLots: 32, unsoldLots: 8,
    totalSaleValue: 18500000, createdBy: 'OPS_ADMIN', createdAt: '2024-03-01T09:00:00',
  },
  {
    id: 'EVT-002', eventCode: 'SAMIL-BLR-MAR24-01', eventName: 'Bengaluru Fleet Auction March 2024',
    eventDate: '2024-03-22', venue: 'Nelamangala Automall Hub', city: 'Bengaluru',
    status: 'PLANNED', totalLots: 30, soldLots: 0, unsoldLots: 0,
    totalSaleValue: 0, createdBy: 'OPS_ADMIN', createdAt: '2024-03-05T10:00:00',
  },
  {
    id: 'EVT-003', eventCode: 'SAMIL-CBE-FEB24-01', eventName: 'Coimbatore NBFC Repo Auction',
    eventDate: '2024-02-15', venue: 'Neelambur Automall Yard', city: 'Coimbatore',
    status: 'CLOSED', totalLots: 22, soldLots: 18, unsoldLots: 4,
    totalSaleValue: 9200000, createdBy: 'OPS_ADMIN', createdAt: '2024-02-01T09:00:00',
  },
];

export const MOCK_BIDDERS: Bidder[] = [
  { id: 'BDR-001', bidderId: 'BID2024001', name: 'Karthik Motors', mobile: '9843056789', emdAmount: 50000, emdReceiptNo: 'RCP-2024-001', eventId: 'EVT-001', registeredAt: '2024-03-20T08:00:00', isActive: true },
  { id: 'BDR-002', bidderId: 'BID2024002', name: 'Senthil Auto Works', mobile: '9844067890', emdAmount: 50000, emdReceiptNo: 'RCP-2024-002', eventId: 'EVT-001', registeredAt: '2024-03-20T08:15:00', isActive: true },
  { id: 'BDR-003', bidderId: 'BID2024003', name: 'Vijay Car Traders', mobile: '9845078901', emdAmount: 25000, emdReceiptNo: 'RCP-2024-003', eventId: 'EVT-001', registeredAt: '2024-03-20T08:30:00', isActive: true },
  { id: 'BDR-004', bidderId: 'BID2024004', name: 'Murugan Vehicles', mobile: '9846089012', emdAmount: 50000, emdReceiptNo: 'RCP-2024-004', eventId: 'EVT-002', registeredAt: '2024-03-22T07:45:00', isActive: true },
];

function buildCase(
  id: string, caseNo: string, workflowType: keyof typeof WORKFLOW_FLOWS,
  currentIdx: number, customerId: string, vehicleId: string, eventId: string,
): WorkflowCase {
  const stepIds = WORKFLOW_FLOWS[workflowType];
  return {
    id, caseNo, workflowType, sellerCategory: 'CORPORATE',
    customerId, vehicleId, eventId,
    currentStepId: stepIds[currentIdx],
    status: 'ACTIVE',
    createdAt: '2024-03-01T09:00:00',
    updatedAt: new Date().toISOString(),
    steps: stepIds.map((sid, i) => ({
      id: sid,
      label: sid.replace(/_/g, ' '),
      status: i < currentIdx ? 'COMPLETED' : i === currentIdx ? 'IN_PROGRESS' : 'PENDING',
      completedAt: i < currentIdx ? '2024-03-15T10:00:00' : undefined,
    })),
  };
}

export const MOCK_WORKFLOW_CASES: WorkflowCase[] = [
  buildCase('WF-001', 'CASE-2024-001', 'INWARD_VEHICLE',       9,  'CUST-001', 'VEH-001', 'EVT-001'),
  buildCase('WF-002', 'CASE-2024-002', 'NON_INWARD_VEHICLE',   5,  'CUST-002', 'VEH-002', 'EVT-001'),
  buildCase('WF-003', 'CASE-2024-003', 'SLA_NOT_UPLOADED',     3,  'CUST-002', 'VEH-002', 'EVT-001'),
  buildCase('WF-004', 'CASE-2024-004', 'INWARD_BLUE_JACK',     2,  'CUST-003', 'VEH-003', 'EVT-001'),
  buildCase('WF-005', 'CASE-2024-005', 'NEGOTIATED_SALE',      11, 'CUST-001', 'VEH-004', 'EVT-003'),
  buildCase('WF-006', 'CASE-2024-006', 'PRIVATE_TREATY',       1,  'CUST-004', 'VEH-004', 'EVT-002'),
  buildCase('WF-007', 'CASE-2024-007', 'DEAL_AMENDMENT',       12, 'CUST-001', 'VEH-001', 'EVT-001'),
  buildCase('WF-008', 'CASE-2024-008', 'INWARD_SECOND_VEHICLE',7,  'CUST-004', 'VEH-004', 'EVT-002'),
];
