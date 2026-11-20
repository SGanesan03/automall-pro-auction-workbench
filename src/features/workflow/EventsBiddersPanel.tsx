import React, { useState } from 'react';
import { Calendar, Plus, Users, BadgeIndianRupee } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addEvent, addBidder } from './workflowSlice';
import { AuctionEvent, Bidder } from '../../types/workflow';

const EVT_STATUS: Record<string, string> = {
  PLANNED:    'bg-blue-50 text-blue-700 border-blue-200',
  ACTIVE:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  DAY_CLOSED: 'bg-amber-50 text-amber-700 border-amber-200',
  CLOSED:     'bg-slate-100 text-slate-600 border-slate-200',
};

const EMPTY_EVT: Omit<AuctionEvent, 'id' | 'createdAt'> = {
  eventCode: '', eventName: '', eventDate: '', venue: '', city: '',
  status: 'PLANNED', totalLots: 0, soldLots: 0, unsoldLots: 0,
  totalSaleValue: 0, createdBy: 'OPS_ADMIN',
};

const EMPTY_BDR: Omit<Bidder, 'id' | 'registeredAt'> = {
  bidderId: '', name: '', mobile: '', emdAmount: 50000,
  emdReceiptNo: '', eventId: '', isActive: true,
};

export const EventsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events } = useAppSelector((s) => s.workflow);
  const activeRole = useAppSelector((s) => s.auctions.activeRole);
  const canCreateEvent = activeRole === 'OPS_ADMIN';
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_EVT });

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.eventName) return;
    dispatch(addEvent({ ...form, eventCode: `SAMIL-${form.city.toUpperCase().slice(0,3)}-${Date.now()}` }));
    setForm({ ...EMPTY_EVT });
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Events ({events.length})</h2>
        {canCreateEvent && (
        <button type="button" onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1 rounded-xl bg-[#2E054E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#45126E]">
          <Plus className="h-3.5 w-3.5" /> New Event
        </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-[#2E054E]/20 bg-[#FAF6FD] p-4 space-y-3">
          <p className="text-xs font-bold text-[#2E054E]">Create Auction Event</p>
          <div className="grid grid-cols-2 gap-2.5">
            {([
              ['eventName','Event Name','text'],
              ['eventDate','Event Date','date'],
              ['venue','Venue','text'],
              ['city','City','text'],
              ['totalLots','Expected Lots','number'],
            ] as [keyof typeof form, string, string][]).map(([k, label, type]) => (
              <div key={k} className="space-y-1">
                <label className="text-[11px] text-slate-500">{label}</label>
                <input type={type} value={String(form[k])}
                  onChange={(e) => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-[#2E054E] focus:outline-none" />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
                {['PLANNED','ACTIVE','DAY_CLOSED','CLOSED'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleAdd}
              className="flex-1 rounded-xl bg-[#ED264F] py-1.5 text-xs font-bold text-white hover:bg-[#D11B40]">
              Create Event
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 rounded-xl border border-slate-200 py-1.5 text-xs font-semibold text-slate-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
        {events.map((e) => (
          <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EEFA]">
                  <Calendar className="h-4 w-4 text-[#2E054E]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{e.eventName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{e.eventCode}</p>
                </div>
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${EVT_STATUS[e.status]}`}>
                {e.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="rounded-lg bg-slate-50 p-2 text-center">
                <p className="text-slate-400">Total Lots</p>
                <p className="font-bold text-slate-800">{e.totalLots}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2 text-center">
                <p className="text-emerald-600">Sold</p>
                <p className="font-bold text-emerald-700">{e.soldLots}</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2 text-center">
                <p className="text-amber-600">Unsold</p>
                <p className="font-bold text-amber-700">{e.unsoldLots}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">📍 {e.venue}, {e.city}</span>
              <span className="font-bold text-[#2E054E]">₹{(e.totalSaleValue / 100000).toFixed(1)}L</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BiddersPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bidders, events } = useAppSelector((s) => s.workflow);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_BDR });

  const set = (k: keyof typeof form, v: string | number | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.name || !form.eventId) return;
    dispatch(addBidder({ ...form, bidderId: `BID${Date.now()}` }));
    setForm({ ...EMPTY_BDR });
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Bidders ({bidders.length})</h2>
        <button type="button" onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1 rounded-xl bg-[#2E054E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#45126E]">
          <Plus className="h-3.5 w-3.5" /> Register
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[#2E054E]/20 bg-[#FAF6FD] p-4 space-y-3">
          <p className="text-xs font-bold text-[#2E054E]">Bidder Registration</p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Event</label>
              <select value={form.eventId} onChange={(e) => set('eventId', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
                <option value="">Select event</option>
                {events.map((e) => <option key={e.id} value={e.id}>{e.eventName}</option>)}
              </select>
            </div>
            {([
              ['name','Bidder Name','text'],
              ['mobile','Mobile','text'],
              ['emdAmount','EMD Amount (₹)','number'],
              ['emdReceiptNo','EMD Receipt No','text'],
            ] as [keyof typeof form, string, string][]).map(([k, label, type]) => (
              <div key={k} className="space-y-1">
                <label className="text-[11px] text-slate-500">{label}</label>
                <input type={type} value={String(form[k])}
                  onChange={(e) => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-[#2E054E] focus:outline-none" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleAdd}
              className="flex-1 rounded-xl bg-[#ED264F] py-1.5 text-xs font-bold text-white hover:bg-[#D11B40]">
              Register Bidder
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 rounded-xl border border-slate-200 py-1.5 text-xs font-semibold text-slate-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
        {bidders.map((b) => {
          const evt = events.find((e) => e.id === b.eventId);
          return (
            <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EEFA]">
                    <Users className="h-4 w-4 text-[#2E054E]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{b.name}</p>
                    <p className="text-[11px] text-slate-400">{b.bidderId} • {b.mobile}</p>
                  </div>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${b.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {b.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Event: <strong className="text-slate-700">{evt?.eventName ?? b.eventId}</strong></span>
                <span className="inline-flex items-center gap-1 font-bold text-[#2E054E]">
                  <BadgeIndianRupee className="h-3 w-3" /> EMD: ₹{b.emdAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Receipt: {b.emdReceiptNo}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
