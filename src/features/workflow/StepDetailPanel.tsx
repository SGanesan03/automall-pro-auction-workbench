import React, { useState, useEffect } from 'react';
import {
  Calendar, User, Car, ArrowDownToLine, FileText, Briefcase,
  Play, ClipboardList, Camera, Tag, Users, Gavel, Receipt,
  FileCheck, BadgeIndianRupee, CreditCard, FileOutput, DoorOpen,
  XSquare, Edit3, TrendingDown, Handshake, Shield, Database,
  Link, Menu, UserCheck, AlertCircle, Lock,
} from 'lucide-react';
import { WorkflowCase, WorkflowStepId } from '../../types/workflow';
import { ALL_STEP_DEFS } from './workflowStepDefs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { completeStep } from './workflowSlice';
import { canCompleteStep, STEP_OWNER_LABEL } from '../../auth-rbac/workflowRbac';

const STEP_ICONS: Partial<Record<WorkflowStepId, React.ReactNode>> = {
  EVENT_PLANNER:              <Calendar className="h-5 w-5" />,
  CUSTOMER_REGISTRATION:      <User className="h-5 w-5" />,
  BLUE_JACK_CONFIG:           <Shield className="h-5 w-5" />,
  VEHICLE_REGISTRATION:       <Car className="h-5 w-5" />,
  INWARD_ENTRY:               <ArrowDownToLine className="h-5 w-5" />,
  SLA_UPLOAD:                 <FileText className="h-5 w-5" />,
  SERVICE_REGISTRATION:       <Briefcase className="h-5 w-5" />,
  JOB_REGISTRATION:           <ClipboardList className="h-5 w-5" />,
  JOB_INITIATION:             <Play className="h-5 w-5" />,
  ACTIVITY_LOG:               <ClipboardList className="h-5 w-5" />,
  IMAGE_UPLOAD:               <Camera className="h-5 w-5" />,
  VEHICLE_TAGGING:            <Tag className="h-5 w-5" />,
  ADDITIONAL_VEHICLE_TAGGING: <Tag className="h-5 w-5" />,
  BIDDER_REGISTRATION:        <Users className="h-5 w-5" />,
  SOLD_MARK:                  <Gavel className="h-5 w-5" />,
  MANUAL_RECEIPT:             <Receipt className="h-5 w-5" />,
  SALE_AMOUNT_COLLECTION:     <BadgeIndianRupee className="h-5 w-5" />,
  STATEMENT_OF_SERVICES:      <FileCheck className="h-5 w-5" />,
  MARK_FOR_APPROVAL:          <AlertCircle className="h-5 w-5" />,
  CREDIT_LIMIT:               <CreditCard className="h-5 w-5" />,
  RECEIPT_ENTRY_RSD:          <Receipt className="h-5 w-5" />,
  COLLECTION_MAPPING:         <BadgeIndianRupee className="h-5 w-5" />,
  FINAL_INVOICE:              <FileOutput className="h-5 w-5" />,
  GATE_PASS:                  <DoorOpen className="h-5 w-5" />,
  BUYER_RECEIPT_ENTRY:        <Receipt className="h-5 w-5" />,
  OUTWARD_ENTRY:              <DoorOpen className="h-5 w-5" />,
  SALE_CLOSURE:               <FileCheck className="h-5 w-5" />,
  EVENT_DAY_CLOSURE:          <Calendar className="h-5 w-5" />,
  EVENT_CLOSURE:              <XSquare className="h-5 w-5" />,
  DEAL_AMENDMENT:             <Edit3 className="h-5 w-5" />,
  DEAL_CANCELLATION:          <XSquare className="h-5 w-5" />,
  UNSOLD_DETAILS:             <TrendingDown className="h-5 w-5" />,
  NEGOTIATED_SALE:            <Handshake className="h-5 w-5" />,
  PRIVATE_TREATY_SALE:        <Handshake className="h-5 w-5" />,
  GROUP_MASTER:               <Shield className="h-5 w-5" />,
  SQL_ROLE_MASTER:            <Database className="h-5 w-5" />,
  GROUP_TO_ROLE:              <Link className="h-5 w-5" />,
  MENU_ACCESS_RIGHTS:         <Menu className="h-5 w-5" />,
  GROUP_USER_LINK:            <UserCheck className="h-5 w-5" />,
};

const STEP_FIELDS: Partial<Record<WorkflowStepId, { label: string; type: string; placeholder: string }[]>> = {
  EVENT_PLANNER: [
    { label: 'Event Name', type: 'text', placeholder: 'e.g. Chennai March Mega Auction 2024' },
    { label: 'Event Date', type: 'date', placeholder: '' },
    { label: 'Venue', type: 'text', placeholder: 'e.g. Poonamallee Automall Yard' },
    { label: 'City', type: 'text', placeholder: 'e.g. Chennai' },
    { label: 'Expected Lots', type: 'number', placeholder: '45' },
  ],
  CUSTOMER_REGISTRATION: [
    { label: 'Customer Name', type: 'text', placeholder: 'e.g. HDFC Bank Ltd' },
    { label: 'Customer Type', type: 'text', placeholder: 'CORPORATE / RETAIL / NBFC / BANK' },
    { label: 'GSTIN', type: 'text', placeholder: '33AAAAH0209R1ZQ' },
    { label: 'PAN', type: 'text', placeholder: 'AAAAH0209R' },
    { label: 'Contact Person', type: 'text', placeholder: 'Full name' },
    { label: 'Mobile', type: 'text', placeholder: '98XXXXXXXX' },
    { label: 'Credit Limit (₹)', type: 'number', placeholder: '5000000' },
  ],
  BLUE_JACK_CONFIG: [
    { label: 'Industry Type', type: 'text', placeholder: 'e.g. AUTOMOBILE_DEALER' },
    { label: 'GST %', type: 'number', placeholder: '18' },
    { label: 'Effective From', type: 'date', placeholder: '' },
  ],
  VEHICLE_REGISTRATION: [
    { label: 'Registration No', type: 'text', placeholder: 'TN09BQ1234' },
    { label: 'Make', type: 'text', placeholder: 'e.g. Hyundai' },
    { label: 'Model', type: 'text', placeholder: 'e.g. Creta SX 1.5 CRDi' },
    { label: 'Year', type: 'number', placeholder: '2021' },
    { label: 'Chassis No', type: 'text', placeholder: 'MALA851BLMH123456' },
    { label: 'Engine No', type: 'text', placeholder: 'G4FGKH123456' },
    { label: 'Odometer (km)', type: 'number', placeholder: '42500' },
    { label: 'Hypothecation', type: 'text', placeholder: 'Bank / NBFC name or None' },
  ],
  INWARD_ENTRY: [
    { label: 'Inward Date', type: 'date', placeholder: '' },
    { label: 'Yard Bay', type: 'text', placeholder: 'e.g. Bay A-12' },
    { label: 'Condition on Arrival', type: 'text', placeholder: 'RUNNING / NON_RUNNING / ACCIDENT' },
    { label: 'Keys Received', type: 'text', placeholder: 'YES / NO' },
    { label: 'RC Book Received', type: 'text', placeholder: 'YES / NO' },
  ],
  SLA_UPLOAD: [
    { label: 'SLA Document Ref', type: 'text', placeholder: 'SLA-2024-XXXX' },
    { label: 'Signed Date', type: 'date', placeholder: '' },
    { label: 'Valid Until', type: 'date', placeholder: '' },
  ],
  SERVICE_REGISTRATION: [
    { label: 'Services Selected', type: 'text', placeholder: 'AUCTION, PARKING, DOCUMENTATION...' },
    { label: 'Reserve Price (₹)', type: 'number', placeholder: '850000' },
    { label: 'Parking Charges (₹)', type: 'number', placeholder: '500' },
    { label: 'Mode', type: 'text', placeholder: 'ADD / EDIT' },
  ],
  JOB_REGISTRATION: [
    { label: 'Job No', type: 'text', placeholder: 'JOB-2024-XXXX' },
    { label: 'Service Type', type: 'text', placeholder: 'DOCUMENTATION / REFURBISHMENT / TOWING' },
    { label: 'Assigned To', type: 'text', placeholder: 'Technician name' },
    { label: 'Estimated Hours', type: 'number', placeholder: '4' },
  ],
  JOB_INITIATION: [
    { label: 'Start Date & Time', type: 'datetime-local', placeholder: '' },
    { label: 'Technician ID', type: 'text', placeholder: 'TECH-XXX' },
    { label: 'Remarks', type: 'text', placeholder: 'Initial observations' },
  ],
  ACTIVITY_LOG: [
    { label: 'Activity Description', type: 'text', placeholder: 'e.g. Dent repair completed on left door' },
    { label: 'Performed By', type: 'text', placeholder: 'Technician name' },
    { label: 'Job Complete?', type: 'text', placeholder: 'YES / NO' },
  ],
  IMAGE_UPLOAD: [
    { label: 'Front View URL', type: 'text', placeholder: 'https://...' },
    { label: 'Rear View URL', type: 'text', placeholder: 'https://...' },
    { label: 'Left Side URL', type: 'text', placeholder: 'https://...' },
    { label: 'Right Side URL', type: 'text', placeholder: 'https://...' },
    { label: 'Interior URL', type: 'text', placeholder: 'https://...' },
    { label: 'Dashboard URL', type: 'text', placeholder: 'https://...' },
  ],
  VEHICLE_TAGGING: [
    { label: 'Lot No', type: 'text', placeholder: 'LOT-001' },
    { label: 'Event ID', type: 'text', placeholder: 'EVT-001' },
    { label: 'Tag Type', type: 'text', placeholder: 'PRIMARY' },
  ],
  ADDITIONAL_VEHICLE_TAGGING: [
    { label: 'Additional Lot No', type: 'text', placeholder: 'LOT-002' },
    { label: 'Event ID', type: 'text', placeholder: 'EVT-001' },
    { label: 'Tag Type', type: 'text', placeholder: 'ADDITIONAL' },
  ],
  BIDDER_REGISTRATION: [
    { label: 'Bidder Name', type: 'text', placeholder: 'e.g. Karthik Motors' },
    { label: 'Mobile', type: 'text', placeholder: '98XXXXXXXX' },
    { label: 'EMD Amount (₹)', type: 'number', placeholder: '50000' },
    { label: 'EMD Receipt No', type: 'text', placeholder: 'RCP-2024-XXX' },
  ],
  SOLD_MARK: [
    { label: 'Winning Bidder ID', type: 'text', placeholder: 'BID2024XXX' },
    { label: 'Hammer Price (₹)', type: 'number', placeholder: '875000' },
    { label: 'Seller Approval', type: 'text', placeholder: 'APPROVED / PENDING' },
  ],
  MANUAL_RECEIPT: [
    { label: 'Receipt No', type: 'text', placeholder: 'RCP-CORP-2024-XXX' },
    { label: 'Amount (₹)', type: 'number', placeholder: '875000' },
    { label: 'Payment Mode', type: 'text', placeholder: 'NEFT / RTGS / CHEQUE' },
    { label: 'Bank Ref No', type: 'text', placeholder: 'UTR/Cheque No' },
  ],
  SALE_AMOUNT_COLLECTION: [
    { label: 'Collection Amount (₹)', type: 'number', placeholder: '875000' },
    { label: 'Payment Mode', type: 'text', placeholder: 'CASH / UPI / NEFT' },
    { label: 'Receipt No', type: 'text', placeholder: 'RCP-RETAIL-2024-XXX' },
  ],
  STATEMENT_OF_SERVICES: [
    { label: 'Auction Commission (₹)', type: 'number', placeholder: '17500' },
    { label: 'Parking Charges (₹)', type: 'number', placeholder: '1500' },
    { label: 'Documentation Fee (₹)', type: 'number', placeholder: '2000' },
    { label: 'GST %', type: 'number', placeholder: '18' },
    { label: 'Discount Applied (₹)', type: 'number', placeholder: '0' },
  ],
  MARK_FOR_APPROVAL: [
    { label: 'Discount Amount (₹)', type: 'number', placeholder: '5000' },
    { label: 'Discount Reason', type: 'text', placeholder: 'Long-standing customer' },
    { label: 'Approver', type: 'text', placeholder: 'Manager name' },
  ],
  CREDIT_LIMIT: [
    { label: 'Credit Limit Available (₹)', type: 'number', placeholder: '3800000' },
    { label: 'Amount to Adjust (₹)', type: 'number', placeholder: '875000' },
    { label: 'Approval Ref', type: 'text', placeholder: 'CL-APPR-2024-XXX' },
  ],
  RECEIPT_ENTRY_RSD: [
    { label: 'RSD Receipt No', type: 'text', placeholder: 'RSD-2024-XXX' },
    { label: 'RSD Amount (₹)', type: 'number', placeholder: '100000' },
    { label: 'Deposit Date', type: 'date', placeholder: '' },
  ],
  COLLECTION_MAPPING: [
    { label: 'Receipt No', type: 'text', placeholder: 'RCP-2024-XXX' },
    { label: 'Mapped Amount (₹)', type: 'number', placeholder: '875000' },
    { label: 'Invoice Line Item', type: 'text', placeholder: 'Auction Commission / Parking...' },
  ],
  FINAL_INVOICE: [
    { label: 'Invoice No', type: 'text', placeholder: 'INV-2024-XXXX' },
    { label: 'Total Amount (₹)', type: 'number', placeholder: '895000' },
    { label: 'GST Amount (₹)', type: 'number', placeholder: '35100' },
  ],
  GATE_PASS: [
    { label: 'Gate Pass No', type: 'text', placeholder: 'GP-2024-XXXX' },
    { label: 'Buyer Dues (₹)', type: 'number', placeholder: '0' },
    { label: 'Adjustment Type', type: 'text', placeholder: 'AUTO_ADJUST / MANUAL_RECEIPT' },
  ],
  BUYER_RECEIPT_ENTRY: [
    { label: 'Buyer Receipt No', type: 'text', placeholder: 'BRCP-2024-XXX' },
    { label: 'Facilitation Fee (₹)', type: 'number', placeholder: '5000' },
    { label: 'Payment Mode', type: 'text', placeholder: 'CASH / UPI' },
  ],
  OUTWARD_ENTRY: [
    { label: 'Outward Date', type: 'date', placeholder: '' },
    { label: 'Driver Name', type: 'text', placeholder: 'Driver full name' },
    { label: 'Driver Mobile', type: 'text', placeholder: '98XXXXXXXX' },
    { label: 'Transport Vehicle No', type: 'text', placeholder: 'TN09XX1234' },
  ],
  SALE_CLOSURE: [
    { label: 'Closure Date', type: 'date', placeholder: '' },
    { label: 'Final Sale Amount (₹)', type: 'number', placeholder: '875000' },
    { label: 'Remarks', type: 'text', placeholder: 'Non-inward sale closed' },
  ],
  EVENT_DAY_CLOSURE: [
    { label: 'Closure Date', type: 'date', placeholder: '' },
    { label: 'Total Lots Sold', type: 'number', placeholder: '32' },
    { label: 'Total Sale Value (₹)', type: 'number', placeholder: '18500000' },
  ],
  EVENT_CLOSURE: [
    { label: 'Final Closure Date', type: 'date', placeholder: '' },
    { label: 'Remarks', type: 'text', placeholder: 'Event fully closed' },
  ],
  DEAL_AMENDMENT: [
    { label: 'Amendment Type', type: 'text', placeholder: 'PRICE_CHANGE / BUYER_CHANGE / TERMS_CHANGE' },
    { label: 'Original Value', type: 'text', placeholder: 'Previous value' },
    { label: 'Amended Value', type: 'text', placeholder: 'New value' },
    { label: 'Reason', type: 'text', placeholder: 'Amendment reason' },
  ],
  DEAL_CANCELLATION: [
    { label: 'Cancellation Reason', type: 'text', placeholder: 'Buyer default / Seller withdrawal' },
    { label: 'Penalty Amount (₹)', type: 'number', placeholder: '25000' },
    { label: 'Cancelled By', type: 'text', placeholder: 'Admin name' },
  ],
  UNSOLD_DETAILS: [
    { label: 'Unsold Reason', type: 'text', placeholder: 'Reserve not met / No bids' },
    { label: 'Highest Bid Received (₹)', type: 'number', placeholder: '750000' },
    { label: 'Next Action', type: 'text', placeholder: 'NEGOTIATED_SALE / RE_AUCTION' },
  ],
  NEGOTIATED_SALE: [
    { label: 'Buyer Name', type: 'text', placeholder: 'Buyer full name' },
    { label: 'Negotiated Price (₹)', type: 'number', placeholder: '800000' },
    { label: 'Original Reserve (₹)', type: 'number', placeholder: '850000' },
    { label: 'Approved By', type: 'text', placeholder: 'Manager name' },
  ],
  PRIVATE_TREATY_SALE: [
    { label: 'Buyer Name', type: 'text', placeholder: 'Buyer full name' },
    { label: 'Sale Price (₹)', type: 'number', placeholder: '900000' },
    { label: 'Terms', type: 'text', placeholder: 'Payment terms / conditions' },
  ],
  GROUP_MASTER: [
    { label: 'Group Code', type: 'text', placeholder: 'GRP-OPS' },
    { label: 'Group Name', type: 'text', placeholder: 'Operations Team' },
    { label: 'Description', type: 'text', placeholder: 'Group description' },
  ],
  SQL_ROLE_MASTER: [
    { label: 'Role Code', type: 'text', placeholder: 'ROLE-AUCTION-MGR' },
    { label: 'Role Name', type: 'text', placeholder: 'Auction Manager' },
    { label: 'Description', type: 'text', placeholder: 'Role description' },
  ],
  GROUP_TO_ROLE: [
    { label: 'Group ID', type: 'text', placeholder: 'GRP-OPS' },
    { label: 'Role ID', type: 'text', placeholder: 'ROLE-AUCTION-MGR' },
  ],
  MENU_ACCESS_RIGHTS: [
    { label: 'Group ID', type: 'text', placeholder: 'GRP-OPS' },
    { label: 'Menu Code', type: 'text', placeholder: 'MENU-SOLD-MARK' },
    { label: 'Can View', type: 'text', placeholder: 'YES / NO' },
    { label: 'Can Create', type: 'text', placeholder: 'YES / NO' },
    { label: 'Can Edit', type: 'text', placeholder: 'YES / NO' },
    { label: 'Can Delete', type: 'text', placeholder: 'YES / NO' },
  ],
  GROUP_USER_LINK: [
    { label: 'User ID', type: 'text', placeholder: 'USR-SUSR-001' },
    { label: 'User Name', type: 'text', placeholder: 'Login username' },
    { label: 'Group ID', type: 'text', placeholder: 'GRP-OPS' },
  ],
};

interface Props { wfCase: WorkflowCase; }

export const StepDetailPanel: React.FC<Props> = ({ wfCase }) => {
  const dispatch = useAppDispatch();
  const { customers, vehicles, events } = useAppSelector((s) => s.workflow);
  const activeStep = wfCase.steps.find((s) => s.status === 'IN_PROGRESS');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');

  if (!activeStep) {
    const isDone = wfCase.status === 'COMPLETED';
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDone ? 'bg-emerald-100' : 'bg-slate-100'}`}>
          {isDone ? <FileCheck className="h-6 w-6 text-emerald-600" /> : <AlertCircle className="h-6 w-6 text-slate-400" />}
        </div>
        <p className="text-sm font-bold text-slate-700">{isDone ? 'All Steps Completed' : 'No Active Step'}</p>
        <p className="text-xs text-slate-400">{isDone ? 'This workflow case is fully closed.' : 'Select a case with an active step.'}</p>
      </div>
    );
  }

  const def = ALL_STEP_DEFS[activeStep.id];
  const fields = STEP_FIELDS[activeStep.id] ?? [];
  const icon = STEP_ICONS[activeStep.id] ?? <FileText className="h-5 w-5" />;
  const activeRole = useAppSelector((s) => s.workflow.activeRole);
  const allowed = canCompleteStep(activeRole, activeStep.id);
  const ownerInfo = STEP_OWNER_LABEL[activeStep.id];

  // Fix #10: reset form when active step changes
  useEffect(() => {
    setFormValues({});
    setNotes('');
  }, [activeStep.id]);

  const linkedCustomer = customers.find((c) => c.id === wfCase.customerId);
  const linkedVehicle = vehicles.find((v) => v.id === wfCase.vehicleId);
  const linkedEvent = events.find((e) => e.id === wfCase.eventId);

  const handleComplete = () => {
    // Fix #11: persist form data into notes as structured JSON
    const stepData = Object.keys(formValues).length ? JSON.stringify(formValues) : undefined;
    const combinedNotes = [notes, stepData].filter(Boolean).join(' | ');
    dispatch(completeStep({ caseId: wfCase.id, stepId: activeStep.id, notes: combinedNotes || undefined }));
    setFormValues({});
    setNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Step header */}
      <div className="flex items-start gap-3 rounded-xl bg-[#FAF6FD] border border-[#2E054E]/15 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2E054E] text-white">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ED264F]">Active Step</p>
          <h3 className="text-base font-bold text-[#2E054E]">{def?.label ?? activeStep.id.replace(/_/g, ' ')}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{def?.description}</p>
          {def?.conditional && (
            <span className="inline-block mt-1.5 rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] text-amber-700">
              ⚡ {def.conditional}
            </span>
          )}
        </div>
      </div>

      {/* Linked entities summary */}
      {(linkedCustomer || linkedVehicle || linkedEvent) && (
        <div className="grid grid-cols-1 gap-2">
          {linkedCustomer && (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-[#2E054E]" /> Customer</span>
              <span className="font-semibold text-slate-800">{linkedCustomer.name} <span className="text-slate-400">({linkedCustomer.type})</span></span>
            </div>
          )}
          {linkedVehicle && (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5"><Car className="h-3.5 w-3.5 text-[#2E054E]" /> Vehicle</span>
              <span className="font-semibold text-slate-800">{linkedVehicle.year} {linkedVehicle.make} {linkedVehicle.model} <span className="text-slate-400">({linkedVehicle.registrationNo})</span></span>
            </div>
          )}
          {linkedEvent && (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#2E054E]" /> Event</span>
              <span className="font-semibold text-slate-800">{linkedEvent.eventName} <span className={`ml-1 rounded px-1.5 py-0.5 text-[10px] ${linkedEvent.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{linkedEvent.status}</span></span>
            </div>
          )}
        </div>
      )}

      {/* Step form fields */}
      {fields.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Step Data Entry</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={formValues[f.label] ?? ''}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, [f.label]: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-[#F8F7FA] px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#2E054E] focus:bg-white focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes & complete — locked if role not permitted */}
      {allowed ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Completion notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#2E054E] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleComplete}
            className="w-full rounded-xl bg-[#ED264F] py-2.5 text-xs font-bold text-white hover:bg-[#D11B40] transition-colors"
          >
            Mark Step as Completed →
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Lock className="h-5 w-5 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-600">Step locked for your persona</p>
            <p className="text-[11px] text-slate-400">
              This step is owned by <strong>{ownerInfo?.owner ?? 'another role'}</strong>.
              Switch persona to complete it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
