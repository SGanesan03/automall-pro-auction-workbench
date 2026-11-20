import { useEffect, useMemo, useState } from 'react';
import { WorkflowManager } from './features/workflow/WorkflowManager';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  clearBannerError,
  selectLot,
  setActiveRole,
  setCategoryFilter,
  setCityFilter,
  setSearchQuery,
  setStatusFilter,
  submitVehicleBid,
  tickAuctionTimers,
  toggleLiveTick,
  toggleSimulateFault,
} from './features/auctions/auctionSlice';
import { AUCTION_ROLES, canPerform } from './auth-rbac/auctionRbac';
import { formatRegistration, sanitizeQuery } from './shared/utils/security';
import { useDebouncedValue } from './shared/hooks/useDebouncedValue';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { ServiceLifecycleDrawer } from './features/auctions/ServiceLifecycleDrawer';
import { ActorRole } from './types/rbac';
import { AuctionLotStatus } from './types/auction';
import {
  Car,
  Clock,
  Gavel,
  Search,
  ShieldCheck,
  AlertCircle,
  Wallet,
  History,
  CheckCircle2,
  MapPin,
  GitBranch,
  LayoutDashboard,
} from 'lucide-react';

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Closed';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
}

const STATUS_BADGES: Record<AuctionLotStatus, { label: string; style: string }> = {
  LIVE_BIDDING: { label: 'Live Auction', style: 'bg-rose-50 text-[#ED264F] border-rose-200' },
  PENDING_SELLER_APPROVAL: {
    label: 'Awaiting Seller Sign-Off',
    style: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  BID_APPROVED: {
    label: 'Bid Approved • RTO Active',
    style: 'bg-[#F5EEFA] text-[#2E054E] border-[#2E054E]/20',
  },
  SETTLED_DELIVERED: {
    label: 'Settled & Delivered',
    style: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
};

export default function App() {
  const dispatch = useAppDispatch();
  const {
    activeRole,
    emdBalance,
    lots,
    selectedLotId,
    searchQuery,
    categoryFilter,
    cityFilter,
    statusFilter,
    liveTickEnabled,
    simulateNetworkFault,
    busyLotIds,
    bannerError,
    auditLog,
  } = useAppSelector((s) => s.auctions);

  const [showAuditModal, setShowAuditModal] = useState(false);
  const [appTab, setAppTab] = useState<'AUCTION' | 'WORKFLOW'>('AUCTION');
  const [visibleCount, setVisibleCount] = useState(24);
  const debouncedSearch = useDebouncedValue(searchQuery, 220);

  useEffect(() => {
    if (appTab !== 'AUCTION') return;
    const timer = window.setInterval(() => {
      dispatch(tickAuctionTimers());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [dispatch, appTab]);

  const canBid = canPerform(activeRole, 'PLACE_BID');
  const canSeeReserve = canPerform(activeRole, 'VIEW_SELLER_RESERVE');
  const canSeeAudit = canPerform(activeRole, 'VIEW_AUDIT_LOG');

  const filteredLots = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return lots.filter((lot) => {
      if (categoryFilter !== 'ALL' && lot.category !== categoryFilter) return false;
      if (cityFilter !== 'ALL' && lot.city !== cityFilter) return false;
      if (statusFilter !== 'ALL' && lot.status !== statusFilter) return false;
      if (q) {
        const matchTitle = lot.title.toLowerCase().includes(q);
        const matchCode = lot.lotCode.toLowerCase().includes(q);
        const matchYard = lot.yardName.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchYard) return false;
      }
      return true;
    });
  }, [lots, debouncedSearch, categoryFilter, cityFilter, statusFilter]);

  const metrics = useMemo(() => {
    let liveCount = 0;
    let totalPipeline = 0;
    for (const l of filteredLots) {
      if (l.status === 'LIVE_BIDDING') liveCount++;
      totalPipeline += l.currentHighestBid;
    }
    return { liveCount, totalPipeline };
  }, [filteredLots]);

  const handleQuickBid = (lotId: string, nextAmount: number) => {
    dispatch(
      submitVehicleBid({
        lotId,
        bidAmount: nextAmount,
        role: activeRole,
        shouldFail: simulateNetworkFault,
      })
    );
  };

  const roleInfo = AUCTION_ROLES[activeRole];

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-slate-900">
      {/* Spinny-Inspired Clean White & Deep Plum Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2E054E] text-white shadow-sm">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-[#2E054E]">
                  AutoMall Pro
                </span>
                <span className="rounded-full bg-[#FFF1F4] border border-[#ED264F]/25 px-2.5 py-0.5 text-[11px] font-bold text-[#ED264F]">
                  Phygital Auctions &amp; Vehicle Services
                </span>
              </div>
              <p className="text-xs text-slate-500">
                200-Point Inspected Inventory • Live Bidding • RTO, Yard &amp; Logistics Governance
              </p>
            </div>
          </div>

          {/* Top-level App Tab Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-[#F8F7FA] p-1">
            <button
              type="button"
              onClick={() => setAppTab('AUCTION')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                appTab === 'AUCTION' ? 'bg-[#2E054E] text-white shadow-sm' : 'text-slate-600 hover:text-[#2E054E]'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Auction Workbench
            </button>
            <button
              type="button"
              onClick={() => setAppTab('WORKFLOW')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                appTab === 'WORKFLOW' ? 'bg-[#2E054E] text-white shadow-sm' : 'text-slate-600 hover:text-[#2E054E]'
              }`}
            >
              <GitBranch className="h-3.5 w-3.5" /> Workflow Manager
            </button>
          </div>

          {/* EMD Wallet, Audit Log & Persona Role Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#FAF6FD] px-3 py-1.5 text-xs">
              <Wallet className="h-4 w-4 text-[#2E054E]" />
              <span className="text-slate-500">EMD Deposit:</span>
              <span className="font-bold text-[#2E054E]">
                ₹{emdBalance.toLocaleString('en-IN')}
              </span>
            </div>

            {canSeeAudit && (
              <button
                type="button"
                onClick={() => setShowAuditModal((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <History className="h-3.5 w-3.5 text-[#2E054E]" />
                Audit Trail ({auditLog.length})
              </button>
            )}

            <div className="flex items-center gap-2">
              <label htmlFor="persona-select" className="text-xs font-medium text-slate-500">
                Persona:
              </label>
              <select
                id="persona-select"
                value={activeRole}
                onChange={(e) => dispatch(setActiveRole(e.target.value as ActorRole))}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold focus:outline-none ${roleInfo.badgeStyle}`}
              >
                <option value="BUYER">Registered Bidder / Dealer</option>
                <option value="SELLER_NBFC">Seller / NBFC Institution</option>
                <option value="OPS_ADMIN">Automall Ops &amp; RTO Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Role Context Sub-Bar */}
        <div className="border-t border-slate-100 bg-[#FAF6FD]">
          <div className="mx-auto max-w-7xl px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-600">{roleInfo.tagline}</span>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={liveTickEnabled}
                  onChange={() => dispatch(toggleLiveTick())}
                  className="rounded text-[#2E054E]"
                />
                Live Countdown Timers
              </label>
              <label className="inline-flex items-center gap-1.5 text-[#ED264F] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateNetworkFault}
                  onChange={() => dispatch(toggleSimulateFault())}
                  className="rounded text-[#ED264F]"
                />
                Simulate Gateway Fault (Test Bid Rollback)
              </label>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-5">
        {appTab === 'WORKFLOW' && <WorkflowManager />}
        {appTab === 'AUCTION' && (<>
        {/* Error / Rollback Toast Banner */}
        {bannerError && (
          <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 text-[#ED264F] shrink-0" />
              <span>{bannerError}</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch(clearBannerError())}
              className="font-bold underline hover:text-rose-950"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Collapsible Governance Audit Log */}
        {showAuditModal && canSeeAudit && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#2E054E]">
                Immutable Auction &amp; Lifecycle Governance Log
              </h2>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 text-xs">
              {auditLog.map((entry) => (
                <div key={entry.id} className="py-2 flex items-center justify-between gap-2">
                  <span>
                    <strong className="text-[#2E054E]">[{entry.role}]</strong> {entry.detail}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">{entry.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Pill Strip (Spinny-Style Clean Search & Category Pills) */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(sanitizeQuery(e.target.value)))}
                placeholder="Search make, model, lot ID, or Automall yard..."
                aria-label="Search vehicle lots"
                className="w-full rounded-xl border border-slate-200 bg-[#F8F7FA] pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2E054E] focus:bg-white focus:outline-none"
              />
            </div>

            <select
              aria-label="Filter by city"
              value={cityFilter}
              onChange={(e) => dispatch(setCityFilter(e.target.value))}
              className="rounded-xl border border-slate-200 bg-[#F8F7FA] px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Automall Hubs</option>
              <option value="Chennai">Chennai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Madurai">Madurai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Coimbatore">Coimbatore</option>
            </select>

            <select
              aria-label="Filter by lifecycle status"
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value as AuctionLotStatus | 'ALL'))}
              className="rounded-xl border border-slate-200 bg-[#F8F7FA] px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Auction Stages</option>
              <option value="LIVE_BIDDING">Live Auction</option>
              <option value="PENDING_SELLER_APPROVAL">Awaiting Seller Sign-Off</option>
              <option value="BID_APPROVED">Bid Approved • RTO Active</option>
              <option value="SETTLED_DELIVERED">Settled &amp; Delivered</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'ALL', label: 'All Vehicles' },
                  { id: 'CAR', label: 'Passenger Cars' },
                  { id: 'COMMERCIAL', label: 'Commercial & LCV' },
                  { id: 'TWO_WHEELER', label: 'Two-Wheelers' },
                  { id: 'TRACTOR', label: 'Tractors & Farm' },
                ] as const
              ).map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => dispatch(setCategoryFilter(pill.id))}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    categoryFilter === pill.id
                      ? 'bg-[#2E054E] text-white'
                      : 'bg-[#F8F7FA] text-slate-600 hover:bg-[#F5EEFA] hover:text-[#2E054E]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500">
              Showing <strong className="text-slate-900">{filteredLots.length}</strong> lots •{' '}
              <strong className="text-[#ED264F]">{metrics.liveCount}</strong> live now • Pipeline{' '}
              <strong className="text-[#2E054E]">
                ₹{(metrics.totalPipeline / 100000).toFixed(1)}L
              </strong>
            </div>
          </div>
        </section>

        {/* Master-Detail Workspace: Vehicle Cards Grid + Service & RTO Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Vehicle Auction Cards */}
          <div className="lg:col-span-7 space-y-3">
            <ErrorBoundary fallbackTitle="Auction Feed Error">
              {filteredLots.slice(0, visibleCount).map((lot) => {
                const isSelected = lot.id === selectedLotId;
                const isBusy = busyLotIds.includes(lot.id);
                const nextBid = lot.currentHighestBid + lot.bidIncrement;
                const badge = STATUS_BADGES[lot.status];

                return (
                  <article
                    key={lot.id}
                    onClick={() => dispatch(selectLot(lot.id))}
                    className={`cursor-pointer rounded-2xl border bg-white p-4 transition-all ${
                      isSelected
                        ? 'border-[#2E054E] ring-2 ring-[#2E054E]/15 shadow-md'
                        : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.style}`}
                          >
                            {badge.label}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <ShieldCheck className="h-3 w-3" />
                            Grade {lot.services.inspectionGrade} ({lot.services.inspectionScore}/200)
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {lot.lotCode}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900">{lot.title}</h3>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{lot.odometerKm.toLocaleString('en-IN')} km</span>
                          <span>•</span>
                          <span>{lot.fuel}</span>
                          <span>•</span>
                          <span>{lot.transmission}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <MapPin className="h-3 w-3 text-[#ED264F]" />
                            {lot.city}
                          </span>
                          <span>•</span>
                          <span className="font-mono">
                            {formatRegistration(
                              lot.registrationFull,
                              lot.registrationMasked,
                              canSeeReserve
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Countdown Pill */}
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-semibold text-slate-700">
                          <Clock className="h-3.5 w-3.5 text-[#ED264F]" />
                          {formatCountdown(lot.endsInSeconds)}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-400">
                          {lot.totalBids} bids • {lot.sellerType}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Price & Action Strip */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-5">
                        <div>
                          <div className="text-[11px] text-slate-400">Highest Bid</div>
                          <div className="text-lg font-extrabold text-[#2E054E]">
                            ₹{lot.currentHighestBid.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="text-xs text-slate-500">
                          <div>
                            RTO: <strong className="text-slate-700">{lot.services.rtoStatus}</strong>
                          </div>
                          <div>
                            Yard:{' '}
                            <strong className="text-slate-700">
                              {lot.services.logisticsStatus}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {lot.status === 'LIVE_BIDDING' ? (
                          <button
                            type="button"
                            disabled={!canBid || isBusy}
                            onClick={() => handleQuickBid(lot.id, nextBid)}
                            title={
                              canBid
                                ? `Place instant bid of ₹${nextBid.toLocaleString('en-IN')}`
                                : 'Switch to Registered Bidder persona to place bids'
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#ED264F] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#D11B40] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Gavel className="h-3.5 w-3.5" />
                            Bid ₹{nextBid.toLocaleString('en-IN')}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            View Lifecycle Details
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </ErrorBoundary>
          </div>

          {/* Sticky Right-Hand Vehicle Inspection, Reserve & RTO Drawer */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <ErrorBoundary fallbackTitle="Vehicle Service Drawer Error">
              <ServiceLifecycleDrawer />
            </ErrorBoundary>
          </div>
        </div>
        {filteredLots.length > visibleCount && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + 24)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-[#F5EEFA] hover:text-[#2E054E] shadow-sm"
            >
              Show more ({filteredLots.length - visibleCount} remaining)
            </button>
          </div>
        )}
        </>)}
      </main>
    </div>
  );
}
