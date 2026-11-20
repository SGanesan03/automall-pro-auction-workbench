import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuctionLotStatus,
  GovernanceAuditItem,
  VehicleAuctionLot,
  VehicleCategory,
  VehicleServiceChecklist,
} from '../../types/auction';
import { ActorRole } from '../../types/rbac';
import { canPerform } from '../../auth-rbac/auctionRbac';
import { generateVehicleLots } from './mockAuctionLots';

interface AuctionState {
  activeRole: ActorRole;
  emdBalance: number;
  lots: VehicleAuctionLot[];
  selectedLotId: string;
  searchQuery: string;
  categoryFilter: VehicleCategory | 'ALL';
  cityFilter: string;
  statusFilter: AuctionLotStatus | 'ALL';
  liveTickEnabled: boolean;
  simulateNetworkFault: boolean;
  busyLotIds: string[];
  bannerError: string | null;
  auditLog: GovernanceAuditItem[];
}

const initialLots = generateVehicleLots(180);

const initialState: AuctionState = {
  activeRole: 'BUYER',
  emdBalance: 250000,
  lots: initialLots,
  selectedLotId: initialLots[0].id,
  searchQuery: '',
  categoryFilter: 'ALL',
  cityFilter: 'ALL',
  statusFilter: 'ALL',
  liveTickEnabled: true,
  simulateNetworkFault: false,
  busyLotIds: [],
  bannerError: null,
  auditLog: [
    {
      id: 'AUD-1',
      role: 'OPS_ADMIN',
      action: 'ROLE_SWITCHED',
      lotId: 'SYSTEM',
      detail: 'Initialized AutoMall Pro Phygital Auction & Vehicle Services session (180 lots).',
      timestamp: new Date().toLocaleTimeString('en-IN'),
    },
  ],
};

export const submitVehicleBid = createAsyncThunk<
  { lotId: string; newBid: number; role: ActorRole },
  { lotId: string; bidAmount: number; role: ActorRole; shouldFail: boolean },
  { rejectValue: { lotId: string; prevBid: number; prevTotalBids: number; reason: string } }
>('auctions/submitBid', async (args, { getState, rejectWithValue }) => {
  const state = getState() as { auctions: AuctionState };
  const lot = state.auctions.lots.find((l) => l.id === args.lotId);
  if (!lot) {
    return rejectWithValue({
      lotId: args.lotId,
      prevBid: 0,
      prevTotalBids: 0,
      reason: 'Auction lot not found.',
    });
  }

  const prevBid = lot.currentHighestBid;
  const prevTotalBids = lot.totalBids;

  if (!canPerform(args.role, 'PLACE_BID')) {
    return rejectWithValue({
      lotId: args.lotId,
      prevBid,
      prevTotalBids,
      reason: `Access Blocked: Role ${args.role} cannot place bids.`,
    });
  }

  if (lot.status !== 'LIVE_BIDDING') {
    return rejectWithValue({
      lotId: args.lotId,
      prevBid,
      prevTotalBids,
      reason: 'Bidding is closed for this lot.',
    });
  }

  if (args.bidAmount < prevBid + lot.bidIncrement) {
    return rejectWithValue({
      lotId: args.lotId,
      prevBid,
      prevTotalBids,
      reason: `Minimum valid bid is ₹${(prevBid + lot.bidIncrement).toLocaleString('en-IN')}.`,
    });
  }

  if (state.auctions.emdBalance < 25000) {
    return rejectWithValue({
      lotId: args.lotId,
      prevBid,
      prevTotalBids,
      reason: 'Insufficient EMD security deposit balance.',
    });
  }

  // Guard against rapid double-click: if lot is already being processed, reject
  if (state.auctions.busyLotIds.includes(args.lotId)) {
    return rejectWithValue({
      lotId: args.lotId,
      prevBid,
      prevTotalBids,
      reason: 'Bid already in progress for this lot.',
    });
  }

  await new Promise((r) => setTimeout(r, 300));

  if (args.shouldFail) {
    return rejectWithValue({
      lotId: args.lotId,
      prevBid,
      prevTotalBids,
      reason: 'Simulated auction gateway timeout — optimistic bid rolled back safely.',
    });
  }

  return { lotId: args.lotId, newBid: args.bidAmount, role: args.role };
});

const auctionSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    setActiveRole(state, action: PayloadAction<ActorRole>) {
      state.activeRole = action.payload;
      state.auditLog.unshift({
        id: `AUD-${Date.now()}`,
        role: action.payload,
        action: 'ROLE_SWITCHED',
        lotId: 'SESSION',
        detail: `Switched active workspace persona to ${action.payload}.`,
        timestamp: new Date().toLocaleTimeString('en-IN'),
      });
      if (state.auditLog.length > 200) state.auditLog.length = 200;
    },
    selectLot(state, action: PayloadAction<string>) {
      state.selectedLotId = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setCategoryFilter(state, action: PayloadAction<VehicleCategory | 'ALL'>) {
      state.categoryFilter = action.payload;
    },
    setCityFilter(state, action: PayloadAction<string>) {
      state.cityFilter = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<AuctionLotStatus | 'ALL'>) {
      state.statusFilter = action.payload;
    },
    toggleLiveTick(state) {
      state.liveTickEnabled = !state.liveTickEnabled;
    },
    toggleSimulateFault(state) {
      state.simulateNetworkFault = !state.simulateNetworkFault;
    },
    clearBannerError(state) {
      state.bannerError = null;
    },
    tickAuctionTimers(state) {
      if (!state.liveTickEnabled) return;
      for (const lot of state.lots) {
        if (lot.status === 'LIVE_BIDDING' && lot.endsInSeconds > 0) {
          lot.endsInSeconds -= 1;
          if (lot.endsInSeconds === 0) {
            lot.status = 'PENDING_SELLER_APPROVAL';
          }
        }
      }
    },
    approveLotBid(state, action: PayloadAction<string>) {
      if (!canPerform(state.activeRole, 'APPROVE_WINNING_BID')) {
        state.bannerError = `Permission Denied: ${state.activeRole} cannot approve winning bids.`;
        return;
      }
      const lot = state.lots.find((l) => l.id === action.payload);
      if (lot && (lot.status === 'LIVE_BIDDING' || lot.status === 'PENDING_SELLER_APPROVAL')) {
        lot.status = 'BID_APPROVED';
        lot.endsInSeconds = 0;
        lot.services.rtoStatus = 'TRANSFER_INITIATED';
        lot.services.logisticsStatus = 'DISPATCH_READY';
        state.auditLog.unshift({
          id: `AUD-${Date.now()}`,
          role: state.activeRole,
          action: 'BID_APPROVED',
          lotId: lot.id,
          detail: `Approved winning bid of ₹${lot.currentHighestBid.toLocaleString('en-IN')} for ${lot.title}.`,
          timestamp: new Date().toLocaleTimeString('en-IN'),
        });
        if (state.auditLog.length > 200) state.auditLog.length = 200;
      }
    },
    updateVehicleService(
      state,
      action: PayloadAction<{
        lotId: string;
        rtoStatus: VehicleServiceChecklist['rtoStatus'];
        logisticsStatus: VehicleServiceChecklist['logisticsStatus'];
      }>
    ) {
      if (!canPerform(state.activeRole, 'UPDATE_VEHICLE_SERVICES')) {
        state.bannerError = `Permission Denied: ${state.activeRole} cannot modify RTO/logistics status.`;
        return;
      }
      const lot = state.lots.find((l) => l.id === action.payload.lotId);
      if (lot) {
        lot.services.rtoStatus = action.payload.rtoStatus;
        lot.services.logisticsStatus = action.payload.logisticsStatus;
        if (
          action.payload.rtoStatus === 'COMPLETED' &&
          action.payload.logisticsStatus === 'DELIVERED'
        ) {
          lot.status = 'SETTLED_DELIVERED';
        }
        state.auditLog.unshift({
          id: `AUD-${Date.now()}`,
          role: state.activeRole,
          action: 'SERVICE_UPDATED',
          lotId: lot.id,
          detail: `Updated RTO → ${action.payload.rtoStatus}, Logistics → ${action.payload.logisticsStatus}.`,
          timestamp: new Date().toLocaleTimeString('en-IN'),
        });
        if (state.auditLog.length > 200) state.auditLog.length = 200;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitVehicleBid.pending, (state, action) => {
        const { lotId, bidAmount } = action.meta.arg;
        state.bannerError = null;
        if (!state.busyLotIds.includes(lotId)) {
          state.busyLotIds.push(lotId);
        }
        const lot = state.lots.find((l) => l.id === lotId);
        if (lot) {
          lot.currentHighestBid = bidAmount;
          lot.totalBids += 1;
        }
      })
      .addCase(submitVehicleBid.fulfilled, (state, action) => {
        const { lotId, newBid, role } = action.payload;
        state.busyLotIds = state.busyLotIds.filter((id) => id !== lotId);
        state.auditLog.unshift({
          id: `AUD-${Date.now()}`,
          role,
          action: 'BID_PLACED',
          lotId,
          detail: `Placed verified bid of ₹${newBid.toLocaleString('en-IN')} on ${lotId}.`,
          timestamp: new Date().toLocaleTimeString('en-IN'),
        });
        if (state.auditLog.length > 200) state.auditLog.length = 200;
      })
      .addCase(submitVehicleBid.rejected, (state, action) => {
        if (action.payload) {
          const { lotId, prevBid, prevTotalBids, reason } = action.payload;
          state.busyLotIds = state.busyLotIds.filter((id) => id !== lotId);
          const lot = state.lots.find((l) => l.id === lotId);
          if (lot) {
            lot.currentHighestBid = prevBid;
            lot.totalBids = prevTotalBids;
          }
          state.bannerError = reason;
        }
      });
  },
});

export const {
  setActiveRole,
  selectLot,
  setSearchQuery,
  setCategoryFilter,
  setCityFilter,
  setStatusFilter,
  toggleLiveTick,
  toggleSimulateFault,
  clearBannerError,
  tickAuctionTimers,
  approveLotBid,
  updateVehicleService,
} = auctionSlice.actions;

export default auctionSlice.reducer;
