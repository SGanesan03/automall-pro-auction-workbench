import { ActorRole } from './rbac';

export type VehicleCategory = 'CAR' | 'COMMERCIAL' | 'TWO_WHEELER' | 'TRACTOR';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
export type TransmissionType = 'Manual' | 'Automatic';

export type AuctionLotStatus =
  | 'LIVE_BIDDING'
  | 'PENDING_SELLER_APPROVAL'
  | 'BID_APPROVED'
  | 'SETTLED_DELIVERED';

export interface VehicleServiceChecklist {
  inspectionGrade: 'A+' | 'A' | 'B+' | 'B';
  inspectionScore: number; // out of 200 checkpoints
  valuationAmount: number;
  rtoStatus: 'RC_VERIFIED' | 'NOC_PENDING' | 'TRANSFER_INITIATED' | 'COMPLETED';
  parkingYard: string;
  logisticsStatus: 'YARD_PARKED' | 'DISPATCH_READY' | 'IN_TRANSIT' | 'DELIVERED';
  financeEligible: boolean;
}

export interface VehicleAuctionLot {
  id: string;
  lotCode: string;
  title: string;
  make: string;
  year: number;
  category: VehicleCategory;
  fuel: FuelType;
  transmission: TransmissionType;
  odometerKm: number;
  registrationMasked: string;
  registrationFull: string;
  city: string;
  yardName: string;
  sellerType: 'NBFC Repo' | 'Bank Fleet' | 'Dealer Trade-In' | 'Corporate Lease';
  reservePrice: number;
  currentHighestBid: number;
  bidIncrement: number;
  totalBids: number;
  endsInSeconds: number;
  status: AuctionLotStatus;
  services: VehicleServiceChecklist;
}

export interface GovernanceAuditItem {
  id: string;
  role: ActorRole;
  action: 'BID_PLACED' | 'BID_APPROVED' | 'SERVICE_UPDATED' | 'ROLE_SWITCHED';
  lotId: string;
  detail: string;
  timestamp: string;
}
