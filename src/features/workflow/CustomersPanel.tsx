import React, { useState } from 'react';
import { User, Plus, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addCustomer } from './workflowSlice';
import { Customer } from '../../types/workflow';

const TYPE_STYLE: Record<string, string> = {
  CORPORATE: 'bg-blue-50 text-blue-700 border-blue-200',
  RETAIL:    'bg-amber-50 text-amber-700 border-amber-200',
  NBFC:      'bg-purple-50 text-purple-700 border-purple-200',
  BANK:      'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const EMPTY: Omit<Customer, 'id' | 'createdAt'> = {
  customerId: '', name: '', type: 'CORPORATE', gstin: '', pan: '',
  contactPerson: '', mobile: '', email: '', address: '', city: '',
  state: '', slaUploaded: false, creditLimit: 0, creditUsed: 0,
  industryType: '',
};

export const CustomersPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((s) => s.workflow);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });

  const set = (k: keyof typeof form, v: string | boolean | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.name || !form.gstin) return;
    dispatch(addCustomer({ ...form, customerId: `CUS${Date.now()}` }));
    setForm({ ...EMPTY });
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Customers ({customers.length})
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1 rounded-xl bg-[#2E054E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#45126E]"
        >
          <Plus className="h-3.5 w-3.5" /> Register
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[#2E054E]/20 bg-[#FAF6FD] p-4 space-y-3">
          <p className="text-xs font-bold text-[#2E054E]">New Customer Registration</p>
          <div className="grid grid-cols-2 gap-2.5">
            {([
              ['name', 'Customer Name', 'text'],
              ['gstin', 'GSTIN', 'text'],
              ['pan', 'PAN', 'text'],
              ['contactPerson', 'Contact Person', 'text'],
              ['mobile', 'Mobile', 'text'],
              ['email', 'Email', 'email'],
              ['city', 'City', 'text'],
              ['state', 'State', 'text'],
              ['industryType', 'Industry Type', 'text'],
              ['creditLimit', 'Credit Limit (₹)', 'number'],
            ] as [keyof typeof form, string, string][]).map(([k, label, type]) => (
              <div key={k} className="space-y-1">
                <label className="text-[11px] text-slate-500">{label}</label>
                <input
                  type={type}
                  value={String(form[k])}
                  onChange={(e) => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-[#2E054E] focus:outline-none"
                />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Type</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
              >
                {['CORPORATE','RETAIL','NBFC','BANK'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="sla"
                checked={form.slaUploaded}
                onChange={(e) => set('slaUploaded', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="sla" className="text-xs text-slate-600">SLA Uploaded</label>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={handleAdd}
              className="flex-1 rounded-xl bg-[#ED264F] py-1.5 text-xs font-bold text-white hover:bg-[#D11B40]">
              Save Customer
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 rounded-xl border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
        {customers.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EEFA]">
                  <User className="h-4 w-4 text-[#2E054E]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{c.name}</p>
                  <p className="text-[11px] text-slate-400">{c.customerId}</p>
                </div>
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${TYPE_STYLE[c.type]}`}>
                {c.type}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <span className="text-slate-500">GSTIN: <strong className="text-slate-700">{c.gstin}</strong></span>
              <span className="text-slate-500">City: <strong className="text-slate-700">{c.city}</strong></span>
              <span className="text-slate-500">Contact: <strong className="text-slate-700">{c.contactPerson}</strong></span>
              <span className="text-slate-500">Mobile: <strong className="text-slate-700">{c.mobile}</strong></span>
              <span className="text-slate-500">Credit Limit: <strong className="text-[#2E054E]">₹{c.creditLimit.toLocaleString('en-IN')}</strong></span>
              <span className="text-slate-500">Used: <strong className="text-slate-700">₹{c.creditUsed.toLocaleString('en-IN')}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              {c.slaUploaded
                ? <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold"><ShieldCheck className="h-3 w-3" /> SLA Uploaded</span>
                : <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-semibold"><AlertTriangle className="h-3 w-3" /> SLA Pending</span>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
