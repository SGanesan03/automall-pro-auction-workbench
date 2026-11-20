import React, { useState } from 'react';
import { Car, Plus, ArrowDownToLine } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addVehicle } from './workflowSlice';
import { Vehicle } from '../../types/workflow';

const COND_STYLE: Record<string, string> = {
  RUNNING:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  NON_RUNNING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACCIDENT:    'bg-rose-50 text-rose-700 border-rose-200',
};

const RC_STYLE: Record<string, string> = {
  CLEAR:       'bg-emerald-50 text-emerald-700',
  HYPOTHECATED:'bg-amber-50 text-amber-700',
  DISPUTED:    'bg-rose-50 text-rose-700',
};

const EMPTY: Omit<Vehicle, 'id' | 'createdAt'> = {
  vehicleId: '', customerId: '', make: '', model: '', year: 2021,
  registrationNo: '', chassisNo: '', engineNo: '', color: '',
  fuelType: 'Diesel', odometerKm: 0, condition: 'RUNNING',
  hypothecation: '', rcStatus: 'CLEAR', isInward: false,
};

export const VehiclesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, customers } = useAppSelector((s) => s.workflow);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });

  const set = (k: keyof typeof form, v: string | boolean | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.registrationNo || !form.make) return;
    dispatch(addVehicle({ ...form, vehicleId: `VH${Date.now()}` }));
    setForm({ ...EMPTY });
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Vehicles ({vehicles.length})
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
          <p className="text-xs font-bold text-[#2E054E]">New Vehicle Registration</p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Customer</label>
              <select
                value={form.customerId}
                onChange={(e) => set('customerId', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {([
              ['registrationNo','Reg No','text'],
              ['make','Make','text'],
              ['model','Model','text'],
              ['year','Year','number'],
              ['chassisNo','Chassis No','text'],
              ['engineNo','Engine No','text'],
              ['color','Color','text'],
              ['odometerKm','Odometer (km)','number'],
              ['hypothecation','Hypothecation','text'],
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
              <label className="text-[11px] text-slate-500">Condition</label>
              <select value={form.condition} onChange={(e) => set('condition', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
                {['RUNNING','NON_RUNNING','ACCIDENT'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">RC Status</label>
              <select value={form.rcStatus} onChange={(e) => set('rcStatus', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
                {['CLEAR','HYPOTHECATED','DISPUTED'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="inward" checked={form.isInward}
                onChange={(e) => set('isInward', e.target.checked)} className="rounded" />
              <label htmlFor="inward" className="text-xs text-slate-600">Inward Vehicle</label>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={handleAdd}
              className="flex-1 rounded-xl bg-[#ED264F] py-1.5 text-xs font-bold text-white hover:bg-[#D11B40]">
              Save Vehicle
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 rounded-xl border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
        {vehicles.map((v) => {
          const owner = customers.find((c) => c.id === v.customerId);
          return (
            <div key={v.id} className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EEFA]">
                    <Car className="h-4 w-4 text-[#2E054E]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{v.year} {v.make} {v.model}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{v.registrationNo}</p>
                  </div>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${COND_STYLE[v.condition]}`}>
                  {v.condition}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                <span className="text-slate-500">Owner: <strong className="text-slate-700">{owner?.name ?? v.customerId}</strong></span>
                <span className="text-slate-500">Fuel: <strong className="text-slate-700">{v.fuelType}</strong></span>
                <span className="text-slate-500">Odometer: <strong className="text-slate-700">{v.odometerKm.toLocaleString('en-IN')} km</strong></span>
                <span className="text-slate-500">Hypothecation: <strong className="text-slate-700">{v.hypothecation || 'None'}</strong></span>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold w-fit ${RC_STYLE[v.rcStatus]}`}>RC: {v.rcStatus}</span>
                {v.isInward && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#2E054E] font-semibold">
                    <ArrowDownToLine className="h-3 w-3" /> Inward {v.inwardDate}
                  </span>
                )}
              </div>
              {v.yardLocation && (
                <p className="text-[11px] text-slate-500">📍 {v.yardLocation}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
