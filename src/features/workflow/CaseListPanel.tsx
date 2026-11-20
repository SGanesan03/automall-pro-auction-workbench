import React, { useState } from 'react';
import { Plus, FileText, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCase, createCase } from './workflowSlice';
import { WorkflowType, PaymentFlowType } from '../../types/workflow';
import { PAYMENT_FLOWS } from './workflowStepDefs';

const FLOW_LABELS: Record<WorkflowType, string> = {
  INWARD_VEHICLE:        'Inward Vehicle',
  NON_INWARD_VEHICLE:    'Non-Inward Vehicle',
  INWARD_SECOND_VEHICLE: 'Inward 2nd Vehicle',
  SLA_NOT_UPLOADED:      'SLA Not Uploaded',
  INWARD_BLUE_JACK:      'Inward — Blue Jack',
  NON_INWARD_BLUE_JACK:  'Non-Inward — Blue Jack',
  DEAL_AMENDMENT:        'Deal Amendment',
  DEAL_CANCELLATION:     'Deal Cancellation',
  NEGOTIATED_SALE:       'Negotiated Sale',
  PRIVATE_TREATY:        'Private Treaty',
};

const PAYMENT_LABELS: Record<PaymentFlowType, string> = {
  CREDIT_LIMIT_SELLER: 'Credit Limit Payment — Seller',
  RSD_PAYMENT_SELLER:  'RSD Payment — Seller',
  GROUP_USER_LINK:     'Group ID & User Link (SUSR)',
};

const STATUS_PILL: Record<string, string> = {
  ACTIVE:    'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  ACTIVE:    <Clock3 className="h-3 w-3" />,
  COMPLETED: <CheckCircle2 className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
};

type CaseMode = 'WORKFLOW' | 'PAYMENT';

export const CaseListPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cases, selectedCaseId, activeRole } = useAppSelector((s) => s.workflow);
  const canCreate = activeRole !== 'BUYER';

  const [showNew, setShowNew] = useState(false);
  const [caseMode, setCaseMode] = useState<CaseMode>('WORKFLOW');
  const [newType, setNewType] = useState<WorkflowType>('INWARD_VEHICLE');
  const [paymentType, setPaymentType] = useState<PaymentFlowType>('CREDIT_LIMIT_SELLER');
  const [sellerCat, setSellerCat] = useState<'CORPORATE' | 'RETAIL'>('CORPORATE');

  // Fix #4: BUYER sees only cases relevant to bidder steps; others see all
  const visibleCases = activeRole === 'BUYER'
    ? cases.filter((c) => c.steps.some((s) => s.id === 'BIDDER_REGISTRATION' || s.id === 'BUYER_RECEIPT_ENTRY'))
    : cases;

  const handleCreate = () => {
    if (caseMode === 'PAYMENT') {
      // Payment flows use their own step list via paymentFlow field
      dispatch(createCase({
        workflowType: 'INWARD_VEHICLE', // base type, steps overridden by paymentFlow
        paymentFlow: paymentType,
        sellerCategory: sellerCat,
      }));
    } else {
      dispatch(createCase({ workflowType: newType, sellerCategory: sellerCat }));
    }
    setShowNew(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {activeRole === 'BUYER' ? 'My Cases' : 'Workflow Cases'} ({visibleCases.length})
        </h2>
        {canCreate && (
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="inline-flex items-center gap-1 rounded-xl bg-[#2E054E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#45126E]"
          >
            <Plus className="h-3.5 w-3.5" /> New Case
          </button>
        )}
      </div>

      {showNew && (
        <div className="rounded-xl border border-[#2E054E]/20 bg-[#FAF6FD] p-3 space-y-2.5">
          <p className="text-xs font-semibold text-[#2E054E]">Create New Workflow Case</p>

          {/* Case mode toggle */}
          <div className="flex gap-1.5">
            {(['WORKFLOW', 'PAYMENT'] as CaseMode[]).map((m) => (
              <button key={m} type="button" onClick={() => setCaseMode(m)}
                className={`flex-1 rounded-lg border py-1 text-[11px] font-semibold transition-colors ${caseMode === m ? 'bg-[#2E054E] text-white border-[#2E054E]' : 'bg-white text-slate-600 border-slate-200'}`}>
                {m === 'WORKFLOW' ? 'Pass Flow' : 'Payment Flow'}
              </button>
            ))}
          </div>

          {caseMode === 'WORKFLOW' ? (
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-500">Flow Type</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value as WorkflowType)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800">
                {(Object.keys(FLOW_LABELS) as WorkflowType[]).map((k) => (
                  <option key={k} value={k}>{FLOW_LABELS[k]}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-500">Payment Flow</label>
              <select value={paymentType} onChange={(e) => setPaymentType(e.target.value as PaymentFlowType)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800">
                {(Object.keys(PAYMENT_LABELS) as PaymentFlowType[]).map((k) => (
                  <option key={k} value={k}>{PAYMENT_LABELS[k]}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                {PAYMENT_FLOWS[paymentType].length} steps in this flow
              </p>
            </div>
          )}

          {/* Seller category — only relevant for non-SUSR flows */}
          {!(caseMode === 'PAYMENT' && paymentType === 'GROUP_USER_LINK') && (
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-500">Seller Category</label>
              <div className="flex gap-2">
                {(['CORPORATE', 'RETAIL'] as const).map((cat) => (
                  <button key={cat} type="button" onClick={() => setSellerCat(cat)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-colors ${sellerCat === cat ? 'bg-[#2E054E] text-white border-[#2E054E]' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {cat}
                    <span className="block text-[9px] font-normal opacity-70">
                      {cat === 'CORPORATE' ? 'Manual Receipt' : 'Sale Collection'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={handleCreate}
              className="flex-1 rounded-xl bg-[#ED264F] py-1.5 text-xs font-bold text-white hover:bg-[#D11B40]">
              Create
            </button>
            <button type="button" onClick={() => setShowNew(false)}
              className="flex-1 rounded-xl border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
        {visibleCases.map((wfCase) => {
          const completed = wfCase.steps.filter((s) => s.status === 'COMPLETED').length;
          const pct = Math.round((completed / wfCase.steps.length) * 100);
          const isSelected = wfCase.id === selectedCaseId;
          const flowLabel = wfCase.paymentFlow
            ? PAYMENT_LABELS[wfCase.paymentFlow]
            : FLOW_LABELS[wfCase.workflowType];
          return (
            <button key={wfCase.id} type="button" onClick={() => dispatch(selectCase(wfCase.id))}
              className={`w-full text-left rounded-xl border p-3 transition-all ${isSelected ? 'border-[#2E054E] ring-2 ring-[#2E054E]/15 bg-[#FAF6FD]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-[#2E054E] shrink-0" />
                  <span className="text-xs font-bold text-slate-800">{wfCase.caseNo}</span>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_PILL[wfCase.status]}`}>
                  {STATUS_ICON[wfCase.status]} {wfCase.status}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{flowLabel}</p>
              <p className="text-[11px] text-slate-400">{wfCase.sellerCategory} seller</p>
              <div className="mt-2 h-1 w-full rounded-full bg-slate-100">
                <div className="h-1 rounded-full bg-gradient-to-r from-[#2E054E] to-[#ED264F]"
                  style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">{pct}% complete • {completed}/{wfCase.steps.length} steps</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
