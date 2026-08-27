import { useState } from 'react';
import { 
  formatPKR, 
  filterByTenant, 
  Project, 
  VendorLedger, 
  StockItem 
} from '@banaao/core';

// Domain Interfaces
interface TenantWallet {
  tenantId: string;
  balancePaisa: number;
  creditLimitPaisa: number;
}

interface MeteredUsage {
  tenantId: string;
  apiCallsCount: number;
  maxCallsAllowed: number;
  storageUsedMB: number;
}

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', tenantId: 'tenant_01', name: 'Gulberg Heights Villa', budgetPaisa: 1500000000, status: 'ACTIVE' },
  { id: 'p2', tenantId: 'tenant_01', name: 'DHA Commercial Plaza', budgetPaisa: 4500000000, status: 'ACTIVE' },
  { id: 'p3', tenantId: 'tenant_02', name: 'Bahria Town Residency', budgetPaisa: 800000000, status: 'ACTIVE' },
];

const INITIAL_LEDGERS: VendorLedger[] = [
  { tenantId: 'tenant_01', vendorName: 'Bismillah Steel Mill', balancePaisa: 45000000, lastTransaction: '25 Bags Rebar' },
  { tenantId: 'tenant_01', vendorName: 'DG Cement Supplier', balancePaisa: 12000000, lastTransaction: '50 Cement Bags' },
  { tenantId: 'tenant_02', vendorName: 'Al-Madina Bricks', balancePaisa: 8500000, lastTransaction: '10,000 Bricks' },
];

const INITIAL_STOCK: StockItem[] = [
  { tenantId: 'tenant_01', name: 'DG Cement', quantityOnHand: 25, unit: 'Bags' },
  { tenantId: 'tenant_01', name: 'Steel Rebar (60 Grade)', quantityOnHand: 4.5, unit: 'Tons' },
  { tenantId: 'tenant_02', name: 'Red Bricks', quantityOnHand: 15000, unit: 'Pcs' },
];

const INITIAL_WALLETS: Record<string, TenantWallet> = {
  tenant_01: { tenantId: 'tenant_01', balancePaisa: 500000000, creditLimitPaisa: 1000000000 },
  tenant_02: { tenantId: 'tenant_02', balancePaisa: 120000000, creditLimitPaisa: 300000000 },
};

const INITIAL_USAGE: Record<string, MeteredUsage> = {
  tenant_01: { tenantId: 'tenant_01', apiCallsCount: 4210, maxCallsAllowed: 10000, storageUsedMB: 240 },
  tenant_02: { tenantId: 'tenant_02', apiCallsCount: 8900, maxCallsAllowed: 10000, storageUsedMB: 680 },
};

export function App() {
  const [activeTenant, setActiveTenant] = useState<'tenant_01' | 'tenant_02'>('tenant_01');
  const [activeRole, setActiveRole] = useState<'OWNER' | 'WORKER'>('OWNER');

  const [projectsList, setProjectsList] = useState<Project[]>(INITIAL_PROJECTS);
  const [ledgersList, setLedgersList] = useState<VendorLedger[]>(INITIAL_LEDGERS);
  const [stockList] = useState<StockItem[]>(INITIAL_STOCK);
  const [wallets, setWallets] = useState(INITIAL_WALLETS);
  const [usage, setUsage] = useState(INITIAL_USAGE);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentWallet = wallets[activeTenant];
  const currentUsage = usage[activeTenant];

  const triggerApiCall = () => {
    if (currentUsage.apiCallsCount >= currentUsage.maxCallsAllowed) {
      setErrorMessage('ERR_METERING_EXCEEDED: API Call quota limit reached for this tenant billing cycle!');
      return;
    }
    setErrorMessage(null);
    setUsage({
      ...usage,
      [activeTenant]: {
        ...currentUsage,
        apiCallsCount: currentUsage.apiCallsCount + 1,
      },
    });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    triggerApiCall();
    if (!newProjectName || !newProjectBudget) return;

    if (activeRole !== 'OWNER') {
      setErrorMessage('RBAC_FORBIDDEN: Only OWNER can add new projects.');
      return;
    }

    const newProject: Project = {
      id: `p_${Date.now()}`,
      tenantId: activeTenant,
      name: newProjectName,
      budgetPaisa: Number(newProjectBudget) * 100,
      status: 'ACTIVE',
    };

    setProjectsList([...projectsList, newProject]);
    setNewProjectName('');
    setNewProjectBudget('');
  };

  const handlePayVendor = (vendorName: string) => {
    triggerApiCall();
    if (activeRole !== 'OWNER') {
      setErrorMessage('RBAC_FORBIDDEN: Worker cannot initiate payments.');
      return;
    }

    const payAmount = 5000000; // 50,000 PKR
    if (currentWallet.balancePaisa < payAmount) {
      setErrorMessage('INSUFFICIENT_FUNDS: Tenant wallet balance too low to settle vendor liability.');
      return;
    }

    // Deduct from wallet and update vendor balance
    setWallets({
      ...wallets,
      [activeTenant]: {
        ...currentWallet,
        balancePaisa: currentWallet.balancePaisa - payAmount,
      },
    });

    setLedgersList(
      ledgersList.map((v) => {
        if (v.vendorName === vendorName && v.tenantId === activeTenant) {
          return { ...v, balancePaisa: Math.max(0, v.balancePaisa - payAmount) };
        }
        return v;
      })
    );
  };

  const projects = filterByTenant(projectsList, activeTenant);
  const ledgers = filterByTenant(ledgersList, activeTenant);
  const stock = filterByTenant(stockList, activeTenant);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Banaao.pk ERP Architecture</h1>
            <p className="text-sm text-slate-500">Multi-Tenant Construction Management & Metered SaaS Platform</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tenant Switcher:</label>
              <select
                value={activeTenant}
                onChange={(e) => {
                  setActiveTenant(e.target.value as any);
                  setErrorMessage(null);
                }}
                className="bg-white border border-slate-300 rounded text-sm px-2 py-1 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="tenant_01">Tenant 1 (Main Builder)</option>
                <option value="tenant_02">Tenant 2 (Sub Contractor)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">RBAC Role:</label>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as any)}
                className="bg-white border border-slate-300 rounded text-sm px-2 py-1 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="OWNER">Owner (Full Access)</option>
                <option value="WORKER">Worker (Read Only)</option>
              </select>
            </div>
          </div>
        </header>

        {/* Error Guardrail Banner */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex justify-between items-center text-sm font-medium">
            <span>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
          </div>
        )}

        {/* Tenant Billing & Metering Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenant Escrow Wallet</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{formatPKR(currentWallet.balancePaisa)}</div>
            <p className="text-xs text-slate-400 mt-1">Credit Limit: {formatPKR(currentWallet.creditLimitPaisa)}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">API Metering Quota</span>
            <div className="text-xl font-bold text-blue-600 mt-1">{currentUsage.apiCallsCount} / {currentUsage.maxCallsAllowed} reqs</div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${currentUsage.apiCallsCount > 8000 ? 'bg-amber-500' : 'bg-blue-600'}`} 
                style={{ width: `${(currentUsage.apiCallsCount / currentUsage.maxCallsAllowed) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage Usage</span>
            <div className="text-xl font-bold text-indigo-600 mt-1">{currentUsage.storageUsedMB} MB</div>
            <p className="text-xs text-slate-400 mt-1">Documents & Site logs persistent storage</p>
          </div>
        </div>

        {/* Add Project Form (Owner Only) */}
        {activeRole === 'OWNER' && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Add New Construction Site Project</h2>
            <form onSubmit={handleAddProject} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Project Name (e.g. Executive Plaza)"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder="Budget in PKR"
                value={newProjectBudget}
                onChange={(e) => setNewProjectBudget(e.target.value)}
                className="w-full md:w-48 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition shadow-sm"
              >
                + Create Project
              </button>
            </form>
          </section>
        )}

        {/* Projects & Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Active Projects ({projects.length})</h2>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-slate-900">{p.name}</h3>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">{p.status}</span>
                  </div>
                  <div className="text-right font-semibold text-emerald-600">{formatPKR(p.budgetPaisa)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Inventory On-Hand</h2>
            <div className="space-y-3">
              {stock.map((s, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="font-medium text-slate-800">{s.name}</span>
                  <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-100">{s.quantityOnHand} {s.unit}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Vendor Udhaar Ledger Table */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Vendor Udhaar Ledger & Settle Operations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="p-3">Vendor Name</th>
                  <th className="p-3">Recent Item</th>
                  <th className="p-3">Payable Balance</th>
                  <th className="p-3">RBAC Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgers.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-900">{v.vendorName}</td>
                    <td className="p-3 text-slate-500">{v.lastTransaction}</td>
                    <td className="p-3 font-bold text-rose-600">{formatPKR(v.balancePaisa)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handlePayVendor(v.vendorName)}
                        disabled={activeRole === 'WORKER'}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                          activeRole === 'WORKER'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                        }`}
                      >
                        Pay 50,000 PKR
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