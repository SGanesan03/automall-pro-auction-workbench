import {
  AuctionLotStatus,
  FuelType,
  TransmissionType,
  VehicleAuctionLot,
  VehicleCategory,
} from '../../types/auction';

interface SeedModel {
  make: string;
  title: string;
  category: VehicleCategory;
  fuel: FuelType;
  transmission: TransmissionType;
  basePrice: number;
}

const MODELS: SeedModel[] = [
  { make: 'Hyundai', title: 'Hyundai Creta SX 1.5 CRDi', category: 'CAR', fuel: 'Diesel', transmission: 'Manual', basePrice: 840000 },
  { make: 'Maruti Suzuki', title: 'Maruti Baleno Alpha AMT', category: 'CAR', fuel: 'Petrol', transmission: 'Automatic', basePrice: 615000 },
  { make: 'Tata', title: 'Tata Ace Gold Cx Pickup', category: 'COMMERCIAL', fuel: 'Diesel', transmission: 'Manual', basePrice: 365000 },
  { make: 'Mahindra', title: 'Mahindra XUV700 AX5', category: 'CAR', fuel: 'Diesel', transmission: 'Automatic', basePrice: 1380000 },
  { make: 'Ashok Leyland', title: 'Ashok Leyland Dost+ LS', category: 'COMMERCIAL', fuel: 'Diesel', transmission: 'Manual', basePrice: 495000 },
  { make: 'Royal Enfield', title: 'Royal Enfield Classic 350', category: 'TWO_WHEELER', fuel: 'Petrol', transmission: 'Manual', basePrice: 142000 },
  { make: 'Mahindra', title: 'Mahindra Arjun Novo 605 DI', category: 'TRACTOR', fuel: 'Diesel', transmission: 'Manual', basePrice: 520000 },
  { make: 'Kia', title: 'Kia Seltos HTX IVT', category: 'CAR', fuel: 'Petrol', transmission: 'Automatic', basePrice: 970000 },
];

const CITIES = [
  { city: 'Chennai', yard: 'Poonamallee Automall Yard', code: 'TN-09' },
  { city: 'Bengaluru', yard: 'Nelamangala Automall Hub', code: 'KA-51' },
  { city: 'Madurai', yard: 'Kappalur Automall Yard', code: 'TN-58' },
  { city: 'Hyderabad', yard: 'Patancheru Automall Hub', code: 'TS-08' },
  { city: 'Coimbatore', yard: 'Neelambur Automall Yard', code: 'TN-37' },
];

const SELLERS: VehicleAuctionLot['sellerType'][] = [
  'NBFC Repo',
  'Bank Fleet',
  'Dealer Trade-In',
  'Corporate Lease',
];

const STATUSES: AuctionLotStatus[] = [
  'LIVE_BIDDING',
  'LIVE_BIDDING',
  'PENDING_SELLER_APPROVAL',
  'BID_APPROVED',
  'SETTLED_DELIVERED',
];

export function generateVehicleLots(count = 180): VehicleAuctionLot[] {
  const lots: VehicleAuctionLot[] = [];

  for (let i = 0; i < count; i++) {
    const model = MODELS[(i * 7 + 3) % MODELS.length];
    const loc = CITIES[(i * 11 + 2) % CITIES.length];
    const status = STATUSES[i % STATUSES.length];
    const year = 2019 + (i % 6);
    const reservePrice = model.basePrice + ((i % 5) * 15000);
    const currentHighestBid =
      status === 'LIVE_BIDDING'
        ? reservePrice - 25000 + ((i % 4) * 10000)
        : reservePrice + 15000;
    const regDigits = String(1000 + ((i * 43) % 8999));
    const inspectionScore = 152 + (i % 44);
    const inspectionGrade =
      inspectionScore >= 185 ? 'A+' : inspectionScore >= 172 ? 'A' : inspectionScore >= 160 ? 'B+' : 'B';

    lots.push({
      id: `LOT-${5001 + i}`,
      lotCode: `SAMIL-${loc.code.replace('-', '')}-${String(i + 1).padStart(4, '0')}`,
      title: `${year} ${model.title}`,
      make: model.make,
      year,
      category: model.category,
      fuel: model.fuel,
      transmission: model.transmission,
      odometerKm: 18500 + ((i * 3100) % 78000),
      registrationMasked: `${loc.code}-XX-${regDigits}`,
      registrationFull: `${loc.code}-BQ-${regDigits}`,
      city: loc.city,
      yardName: loc.yard,
      sellerType: SELLERS[i % SELLERS.length],
      reservePrice,
      currentHighestBid,
      bidIncrement: model.category === 'TWO_WHEELER' ? 2500 : 5000,
      totalBids: 4 + (i % 23),
      endsInSeconds: status === 'LIVE_BIDDING' ? 420 + ((i * 97) % 5400) : 0,
      status,
      services: {
        inspectionGrade,
        inspectionScore,
        valuationAmount: reservePrice + 20000,
        rtoStatus:
          status === 'SETTLED_DELIVERED'
            ? 'COMPLETED'
            : status === 'BID_APPROVED'
            ? 'TRANSFER_INITIATED'
            : 'RC_VERIFIED',
        parkingYard: loc.yard,
        logisticsStatus:
          status === 'SETTLED_DELIVERED'
            ? 'DELIVERED'
            : status === 'BID_APPROVED'
            ? 'DISPATCH_READY'
            : 'YARD_PARKED',
        financeEligible: model.category !== 'TWO_WHEELER',
      },
    });
  }

  return lots;
}
