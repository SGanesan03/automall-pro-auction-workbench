import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { approveLotBid, updateVehicleService } from './auctionSlice';
import { canPerform } from '../../auth-rbac/auctionRbac';
import { formatRegistration } from '../../shared/utils/security';
import { VehicleServiceChecklist } from '../../types/auction';
import {
  ShieldCheck,
  FileCheck,
  Truck,
  MapPin,
  BadgeIndianRupee,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';

export const ServiceLifecycleDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lots, selectedLotId, activeRole } = useAppSelector((s) => s.auctions);
  const lot = lots.find((l) => l.id === selectedLotId) || lots[0];

  const canSeeReserve = canPerform(activeRole, 'VIEW_SELLER_RESERVE');
  const canApproveBid = canPerform(activeRole, 'APPROVE_WINNING_BID');
  const canEditServices = canPerform(activeRole, 'UPDATE_VEHICLE_SERVICES');

  if (!lot) return null;

  return (
    <aside className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-5">
      {/* Vehicle Title & Assured Inspection Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5EEFA] px-2.5 py-1 text-[11px] font-bold text-[#2E054E]">
            <Sparkles className="h-3 w-3 text-[#ED264F]" />
            200-Point Inspected • Grade {lot.services.inspectionGrade}
          </span>
          <span className="font-mono text-xs text-slate-400">{lot.lotCode}</span>
        </div>

        <h2 className="mt-2 text-lg font-bold text-[#2E054E]">{lot.title}</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          {lot.odometerKm.toLocaleString('en-IN')} km • {lot.fuel} • {lot.transmission} •{' '}
          {lot.sellerType}
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-[#ED264F]" />
          <span>{lot.yardName}</span>
          <span className="text-slate-300">|</span>
          <span className="font-mono font-medium">
            Reg: {formatRegistration(lot.registrationFull, lot.registrationMasked, canSeeReserve)}
          </span>
        </div>
      </div>

      {/* Pricing, Reserve & Bid Approval Box */}
      <div className="rounded-xl bg-[#FAF6FD] border border-[#2E054E]/10 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Current Highest Bid
            </div>
            <div className="text-2xl font-extrabold text-[#2E054E]">
              ₹{lot.currentHighestBid.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-500">Market Valuation</div>
            <div className="text-sm font-bold text-emerald-700">
              ₹{lot.services.valuationAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Confidential Reserve Price (RBAC Protected) */}
        <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-slate-200/80 text-xs">
          <span className="text-slate-600 font-medium">Seller Reserve Price (ACR)</span>
          {canSeeReserve ? (
            <span className="font-bold text-slate-900">
              ₹{lot.reservePrice.toLocaleString('en-IN')}{' '}
              {lot.currentHighestBid >= lot.reservePrice ? (
                <span className="ml-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-800">
                  MET
                </span>
              ) : (
                <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                  BELOW ACR
                </span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Lock className="h-3 w-3" />
              Confidential (Seller/Admin only)
            </span>
          )}
        </div>

        {/* Seller / Admin Bid Approval Trigger */}
        {canApproveBid &&
          (lot.status === 'LIVE_BIDDING' || lot.status === 'PENDING_SELLER_APPROVAL') && (
            <button
              type="button"
              onClick={() => dispatch(approveLotBid(lot.id))}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E054E] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#45126E] transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Approve Highest Bid & Trigger RTO Transfer
            </button>
          )}
      </div>

      {/* Ancillary Vehicle Services Lifecycle (Inspection, RTO, Yard & Logistics) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Ancillary Vehicle Services Lifecycle
        </h3>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="h-4 w-4 text-[#2E054E]" />
              <span>Inspection Score</span>
            </div>
            <div className="mt-1 font-bold text-slate-900">
              {lot.services.inspectionScore} / 200 pts
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <BadgeIndianRupee className="h-4 w-4 text-emerald-600" />
              <span>NBFC Trade Finance</span>
            </div>
            <div className="mt-1 font-bold text-slate-900">
              {lot.services.financeEligible ? 'Pre-Approved (85% LTV)' : 'Cash Settlement Only'}
            </div>
          </div>
        </div>

        {/* RTO & Logistics Governance Controls */}
        <div className="rounded-xl border border-slate-200 p-3.5 space-y-3 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <FileCheck className="h-4 w-4 text-[#2E054E]" />
              RTO & RC Transfer
            </span>
            <select
              aria-label="RTO transfer status"
              disabled={!canEditServices}
              value={lot.services.rtoStatus}
              onChange={(e) =>
                dispatch(
                  updateVehicleService({
                    lotId: lot.id,
                    rtoStatus: e.target.value as VehicleServiceChecklist['rtoStatus'],
                    logisticsStatus: lot.services.logisticsStatus,
                  })
                )
              }
              className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-800 disabled:opacity-60"
            >
              <option value="RC_VERIFIED">RC Verified</option>
              <option value="NOC_PENDING">NOC Pending</option>
              <option value="TRANSFER_INITIATED">Transfer Initiated</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <Truck className="h-4 w-4 text-[#ED264F]" />
              Yard & Doorstep Logistics
            </span>
            <select
              aria-label="Logistics status"
              disabled={!canEditServices}
              value={lot.services.logisticsStatus}
              onChange={(e) =>
                dispatch(
                  updateVehicleService({
                    lotId: lot.id,
                    rtoStatus: lot.services.rtoStatus,
                    logisticsStatus: e.target.value as VehicleServiceChecklist['logisticsStatus'],
                  })
                )
              }
              className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-800 disabled:opacity-60"
            >
              <option value="YARD_PARKED">Yard Parked</option>
              <option value="DISPATCH_READY">Dispatch Ready</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          {!canEditServices && (
            <p className="text-[11px] text-slate-400">
              Switch to <strong>Automall Ops &amp; RTO Admin</strong> role to update RTO &amp; yard dispatch states.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
