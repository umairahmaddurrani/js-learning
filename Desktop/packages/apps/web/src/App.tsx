import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  budgetPaisa: number;
  status: 'ACTIVE' | 'COMPLETED';
}

interface VendorLedger {
  vendorName: string;
  balancePaisa: number;
  lastTransaction: string;
}

interface StockItem {
  name: string;
  quantityOnHand: number;
  unit: string;
}

export function App() {
  const [activeTenant, setActiveTenant] = useState<'tenant_01' | 'tenant_02'>('tenant_01');
  const [activeRole, setActiveRole] = useState<'OWNER' | 'WORKER'>('OWNER');

  const projects: Record<string, Project[]> = {
    tenant_01: [
      { id: 'p1', name: 'Gulberg Heights Villa', budgetPaisa: 1500000000, status: 'ACTIVE' },
      { id: 'p2', name: 'DHA Commercial Plaza', budgetPaisa: 4500000000, status: 'ACTIVE' },
    ],
    tenant_02: [
      { id: 'p3', name: 'Bahria Town Residency', budgetPaisa: 800000000, status: 'ACTIVE' },
    ],
  };

  const ledgers: Record<string, VendorLedger[]> = {
    tenant_01: [
      { vendorName: 'Bismillah Steel Mill', balancePaisa: 45000000, lastTransaction: '25 Bags Rebar' },
      { vendorName: 'DG Cement Supplier', balancePaisa: 12000000, lastTransaction: '50 Cement Bags' },
    ],
    tenant_02: [
      { vendorName: 'Al-Madina Bricks', balancePaisa: 8500000, lastTransaction: '10,000 Bricks' },
    ],
  };

  const stock: Record<string, StockItem[]> = {
    tenant_01: [
      { name: 'DG Cement', quantityOnHand: 25, unit: 'Bags' },
      { name: 'Steel Rebar (60 Grade)', quantityOnHand: 4.5, unit: 'Tons' },
    ],
    tenant_02: [
      { name: 'Red Bricks', quantityOnHand: 15000, unit: 'Pcs' },
    ],
  };

  const formatPKR = (paisa: number) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(paisa / 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Banaao.pk ERP</h1>
            <p className="text-sm text-slate-500">Construction Multi-Tenant Core Architecture</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tenant Context:</label>
              <select
                value={activeTenant}
                onChange={(e) => setActiveTenant(e.target.value as any)}
                className="bg-white border border-slate-300 rounded text-sm px-2 py-1 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="tenant_01">Tenant 1 (Main Builder)</option>
                <option value="tenant_02">Tenant 2 (Sub Contractor)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">RBAC Context:</label>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as any)}
                className="bg-white border border-slate-300 rounded text-sm px-2 py-1 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="OWNER">Owner (Full Write)</option>
                <option value="WORKER">Worker (Read Only)</option>
              </select>
            </div>
          </div>
        </header>

        {/* 2 Column Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Projects Panel */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Active Projects</h2>
            <div className="space-y-3">
              {projects[activeTenant].map((p) => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-slate-900">{p.name}</h3>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">
                      {p.status}
                    </span>
                  </div>
                  <div className="text-right font-semibold text-emerald-600">
                    {formatPKR(p.budgetPaisa)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stock Tracking Panel */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Inventory On-Hand</h2>
            <div className="space-y-3">
              {stock[activeTenant].map((s, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="font-medium text-slate-800">{s.name}</span>
                  <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-100">
                    {s.quantityOnHand} {s.unit}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Vendor Udhaar Ledger */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Vendor Udhaar Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="p-3">Vendor Name</th>
                  <th className="p-3">Recent Item</th>
                  <th className="p-3">Payable Balance</th>
                  <th className="p-3">RBAC Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgers[activeTenant].map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-900">{v.vendorName}</td>
                    <td className="p-3 text-slate-500">{v.lastTransaction}</td>
                    <td className="p-3 font-bold text-rose-600">{formatPKR(v.balancePaisa)}</td>
                    <td className="p-3">
                      <button
                        disabled={activeRole === 'WORKER'}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                          activeRole === 'WORKER'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                        }`}
                      >
                        Add Transaction
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}

export default App;