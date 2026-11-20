import React from 'react';
import {
  GitBranch, User, Car, Calendar, Users, Shield,
  CheckCircle2, AlertCircle, Info, X, Lock,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setActiveTab, clearBanner, setBanner } from './workflowSlice';
import { canViewTab, ROLE_WORKFLOW_SUMMARY, WorkflowTab } from '../../auth-rbac/workflowRbac';
import { AUCTION_ROLES } from '../../auth-rbac/auctionRbac';
import { CaseListPanel } from './CaseListPanel';
import { WorkflowStepper } from './WorkflowStepper';
import { StepDetailPanel } from './StepDetailPanel';
import { CustomersPanel } from './CustomersPanel';
import { VehiclesPanel } from './VehiclesPanel';
import { EventsPanel, BiddersPanel } from './EventsBiddersPanel';
import { AccessControlPanel } from './AccessControlPanel';

const ALL_TABS: { id: WorkflowTab; label: string; icon: React.ReactNode }[] = [
  { id: 'CASES',          label: 'Workflow Cases',  icon: <GitBranch className="h-4 w-4" /> },
  { id: 'CUSTOMERS',      label: 'Customers',       icon: <User className="h-4 w-4" /> },
  { id: 'VEHICLES',       label: 'Vehicles',        icon: <Car className="h-4 w-4" /> },
  { id: 'EVENTS',         label: 'Events',          icon: <Calendar className="h-4 w-4" /> },
  { id: 'BIDDERS',        label: 'Bidders',         icon: <Users className="h-4 w-4" /> },
  { id: 'ACCESS_CONTROL', label: 'Access Control',  icon: <Shield className="h-4 w-4" /> },
];

const BANNER_STYLE = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error:   'bg-rose-50 border-rose-200 text-rose-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
};
const BANNER_ICON = {
  success: <CheckCircle2 className="h-4 w-4 shrink-0" />,
  error:   <AlertCircle className="h-4 w-4 shrink-0" />,
  info:    <Info className="h-4 w-4 shrink-0" />,
};

export const WorkflowManager: React.FC = () => {
  const dispatch = useAppDispatch();

  // Fix #21: read role directly from auction slice — single source of truth, no sync effect needed
  const activeRole = useAppSelector((s) => s.auctions.activeRole);
  const { activeTab, cases, selectedCaseId, bannerMsg, bannerType } =
    useAppSelector((s) => s.workflow);

  const selectedCase = cases.find((c) => c.id === selectedCaseId);
  const roleInfo = AUCTION_ROLES[activeRole];
  const summary = ROLE_WORKFLOW_SUMMARY[activeRole];

  const handleTabClick = (tab: WorkflowTab) => {
    if (!canViewTab(activeRole, tab)) {
      dispatch(setBanner({ msg: `Access Denied: ${activeRole} cannot access the ${tab.replace('_', ' ')} tab.`, type: 'error' }));
      return;
    }
    dispatch(setActiveTab(tab));
  };

  return (
    <div className="space-y-4">
      {/* Role context bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${roleInfo.badgeStyle}`}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/60">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold">{roleInfo.label} — Workflow Access</p>
            <p className="text-[11px] opacity-80">{roleInfo.tagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {summary.allowed.slice(0, 3).map((a) => (
            <span key={a} className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" /> {a}
            </span>
          ))}
          {summary.denied.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold opacity-70">
              <Lock className="h-2.5 w-2.5 text-rose-500" /> +{summary.denied.length} restricted
            </span>
          )}
        </div>
      </div>

      {/* Banner */}
      {bannerMsg && (
        <div className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 text-xs font-medium shadow-sm ${BANNER_STYLE[bannerType]}`}>
          <div className="flex items-center gap-2">
            {BANNER_ICON[bannerType]}
            <span>{bannerMsg}</span>
          </div>
          <button type="button" onClick={() => dispatch(clearBanner())} className="hover:opacity-70">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Tab strip — locked tabs shown greyed with lock icon */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {ALL_TABS.map((t) => {
          const allowed = canViewTab(activeRole, t.id);
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabClick(t.id)}
              title={!allowed ? `${activeRole} does not have access to ${t.label}` : undefined}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors
                ${isActive && allowed ? 'bg-[#2E054E] text-white shadow-sm' : ''}
                ${!isActive && allowed ? 'text-slate-600 hover:bg-[#F5EEFA] hover:text-[#2E054E]' : ''}
                ${!allowed ? 'cursor-not-allowed text-slate-300 line-through' : ''}
              `}
            >
              {!allowed ? <Lock className="h-3 w-3 shrink-0" /> : t.icon}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'CASES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <CaseListPanel />
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4">
            {selectedCase ? (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#2E054E]">{selectedCase.caseNo}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${selectedCase.status === 'ACTIVE' ? 'bg-blue-50 text-blue-700 border-blue-200' : selectedCase.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          {selectedCase.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm font-bold text-slate-800">
                        {selectedCase.workflowType.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-500">{selectedCase.sellerCategory} Seller • {selectedCase.steps.length} steps</p>
                    </div>
                    <p className="text-[11px] text-slate-400">Updated {new Date(selectedCase.updatedAt).toLocaleTimeString('en-IN')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Pipeline Progress</p>
                    <WorkflowStepper wfCase={selectedCase} />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Step Workspace</p>
                    <StepDetailPanel wfCase={selectedCase} />
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <GitBranch className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-500">Select a workflow case to view its pipeline</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'CUSTOMERS' && canViewTab(activeRole, 'CUSTOMERS') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CustomersPanel />
        </div>
      )}
      {activeTab === 'VEHICLES' && canViewTab(activeRole, 'VEHICLES') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <VehiclesPanel />
        </div>
      )}
      {activeTab === 'EVENTS' && canViewTab(activeRole, 'EVENTS') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <EventsPanel />
        </div>
      )}
      {activeTab === 'BIDDERS' && canViewTab(activeRole, 'BIDDERS') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <BiddersPanel />
        </div>
      )}
      {activeTab === 'ACCESS_CONTROL' && canViewTab(activeRole, 'ACCESS_CONTROL') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <AccessControlPanel />
        </div>
      )}
    </div>
  );
};
