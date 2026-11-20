import React, { useState } from 'react';
import { Shield, Database, Menu, UserCheck } from 'lucide-react';

const MOCK_GROUPS = [
  { id: 'GRP-001', groupCode: 'GRP-OPS', groupName: 'Operations Team', description: 'Yard ops, inward/outward, job management', isActive: true },
  { id: 'GRP-002', groupCode: 'GRP-AUCTION', groupName: 'Auction Team', description: 'Event planning, tagging, sold mark', isActive: true },
  { id: 'GRP-003', groupCode: 'GRP-FINANCE', groupName: 'Finance Team', description: 'Invoice, collection, gate pass', isActive: true },
  { id: 'GRP-004', groupCode: 'GRP-ADMIN', groupName: 'System Admin', description: 'Full access — SUSR configuration', isActive: true },
];

const MOCK_ROLES = [
  { id: 'ROLE-001', roleCode: 'ROLE-OPS-MGR', roleName: 'Operations Manager', description: 'Manage inward, jobs, activity log' },
  { id: 'ROLE-002', roleCode: 'ROLE-AUCTION-MGR', roleName: 'Auction Manager', description: 'Event planner, tagging, sold mark, bidder reg' },
  { id: 'ROLE-003', roleCode: 'ROLE-FINANCE-MGR', roleName: 'Finance Manager', description: 'Statement, invoice, collection, gate pass' },
  { id: 'ROLE-004', roleCode: 'ROLE-SUSR-ADMIN', roleName: 'SUSR Admin', description: 'Group master, role master, menu access, user link' },
];

const MOCK_MENU_ACCESS = [
  { groupCode: 'GRP-OPS',     menu: 'Inward Entry',          view: true,  create: true,  edit: true,  del: false },
  { groupCode: 'GRP-OPS',     menu: 'Job Registration',      view: true,  create: true,  edit: true,  del: false },
  { groupCode: 'GRP-OPS',     menu: 'Activity Log',          view: true,  create: true,  edit: true,  del: false },
  { groupCode: 'GRP-AUCTION', menu: 'Event Planner',         view: true,  create: true,  edit: true,  del: false },
  { groupCode: 'GRP-AUCTION', menu: 'Vehicle Tagging',       view: true,  create: true,  edit: true,  del: false },
  { groupCode: 'GRP-AUCTION', menu: 'Sold Mark',             view: true,  create: true,  edit: true,  del: false },
  { groupCode: 'GRP-AUCTION', menu: 'Bidder Registration',   view: true,  create: true,  edit: false, del: false },
  { groupCode: 'GRP-FINANCE', menu: 'Statement of Services', view: true,  create: true,  edit: true,  del: false },
  { groupCode: 'GRP-FINANCE', menu: 'Final Invoice',         view: true,  create: true,  edit: false, del: false },
  { groupCode: 'GRP-FINANCE', menu: 'Gate Pass',             view: true,  create: true,  edit: false, del: false },
  { groupCode: 'GRP-ADMIN',   menu: 'Group Master',          view: true,  create: true,  edit: true,  del: true  },
  { groupCode: 'GRP-ADMIN',   menu: 'SQL Role Master',       view: true,  create: true,  edit: true,  del: true  },
  { groupCode: 'GRP-ADMIN',   menu: 'Group User Link',       view: true,  create: true,  edit: true,  del: true  },
];

const MOCK_USERS = [
  { userId: 'USR-001', userName: 'ops.manager', groupCode: 'GRP-OPS',     linkedAt: '2024-01-10', isActive: true },
  { userId: 'USR-002', userName: 'auction.mgr', groupCode: 'GRP-AUCTION', linkedAt: '2024-01-10', isActive: true },
  { userId: 'USR-003', userName: 'finance.mgr', groupCode: 'GRP-FINANCE', linkedAt: '2024-01-10', isActive: true },
  { userId: 'USR-004', userName: 'susr.admin',  groupCode: 'GRP-ADMIN',   linkedAt: '2024-01-10', isActive: true },
];

type SubTab = 'GROUPS' | 'ROLES' | 'MENU' | 'USERS';

const TICK = (v: boolean) => (
  <span className={`inline-block h-4 w-4 rounded text-center text-[10px] font-bold leading-4 ${v ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
    {v ? '✓' : '✗'}
  </span>
);

export const AccessControlPanel: React.FC = () => {
  const [sub, setSub] = useState<SubTab>('GROUPS');

  const TABS: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'GROUPS', label: 'Group Master',      icon: <Shield className="h-3.5 w-3.5" /> },
    { id: 'ROLES',  label: 'SQL Role Master',   icon: <Database className="h-3.5 w-3.5" /> },
    { id: 'MENU',   label: 'Menu Access Rights',icon: <Menu className="h-3.5 w-3.5" /> },
    { id: 'USERS',  label: 'Group User Link',   icon: <UserCheck className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Access Control — SUSR Login
      </h2>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSub(t.id)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${sub === t.id ? 'bg-[#2E054E] text-white' : 'bg-slate-100 text-slate-600 hover:bg-[#F5EEFA] hover:text-[#2E054E]'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {sub === 'GROUPS' && (
        <div className="space-y-2">
          {MOCK_GROUPS.map((g) => (
            <div key={g.id} className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#2E054E]" />
                  <span className="text-xs font-bold text-slate-800">{g.groupName}</span>
                  <span className="font-mono text-[10px] text-slate-400">{g.groupCode}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${g.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {g.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{g.description}</p>
            </div>
          ))}
        </div>
      )}

      {sub === 'ROLES' && (
        <div className="space-y-2">
          {MOCK_ROLES.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-[#2E054E]" />
                <span className="text-xs font-bold text-slate-800">{r.roleName}</span>
                <span className="font-mono text-[10px] text-slate-400">{r.roleCode}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{r.description}</p>
            </div>
          ))}
        </div>
      )}

      {sub === 'MENU' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-[11px]">
            <thead className="bg-[#FAF6FD]">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Group</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Menu</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-600">View</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-600">Create</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-600">Edit</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-600">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_MENU_ACCESS.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-3 py-1.5 font-mono text-slate-500">{m.groupCode}</td>
                  <td className="px-3 py-1.5 text-slate-700">{m.menu}</td>
                  <td className="px-2 py-1.5 text-center">{TICK(m.view)}</td>
                  <td className="px-2 py-1.5 text-center">{TICK(m.create)}</td>
                  <td className="px-2 py-1.5 text-center">{TICK(m.edit)}</td>
                  <td className="px-2 py-1.5 text-center">{TICK(m.del)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === 'USERS' && (
        <div className="space-y-2">
          {MOCK_USERS.map((u) => (
            <div key={u.userId} className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-[#2E054E]" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{u.userName}</p>
                    <p className="text-[11px] text-slate-400">{u.userId}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-3 text-[11px]">
                <span className="text-slate-500">Group: <strong className="text-[#2E054E]">{u.groupCode}</strong></span>
                <span className="text-slate-400">Linked: {u.linkedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
