import { TenantId, ProjectId, VendorId, Paisa } from '../ids.js';
import { Project } from '../contract/project.js';
import { Vendor } from '../contract/vendor.js';
import { StockMovement } from '../contract/inventory.js';
import { Billing } from '../contract/billing.js';

export const TENANT_1 = 'tenant-contractor-firm' as TenantId;
export const TENANT_2 = 'tenant-family-build' as TenantId;

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-101' as ProjectId,
    tenantId: TENANT_1,
    name: 'Gulberg Plaza Site',
    status: 'active',
    budget: 500000000 as Paisa, // Rs. 5,000,000
  },
  {
    id: 'proj-201' as ProjectId,
    tenantId: TENANT_2,
    name: 'Dream House DHA',
    status: 'active',
    budget: 200000000 as Paisa, // Rs. 2,000,000
  },
];

export const SEED_VENDORS: Vendor[] = [
  {
    id: 'ven-1' as VendorId,
    tenantId: TENANT_1,
    name: 'Lucky Cement Supplier',
    phone: '03001234567',
    transactions: [
      { id: 'tx-1', type: 'purchase', amount: 15000000 as Paisa, date: '2026-08-01' },
      { id: 'tx-2', type: 'payment', amount: 5000000 as Paisa, date: '2026-08-05' },
    ],
  },
];

export const SEED_INVENTORY: StockMovement[] = [
  {
    id: 'sm-1',
    tenantId: TENANT_1,
    projectId: 'proj-101' as ProjectId,
    item: 'DG Cement',
    type: 'receipt',
    quantity: 100,
    date: '2026-08-10',
  },
  {
    id: 'sm-2',
    tenantId: TENANT_1,
    projectId: 'proj-101' as ProjectId,
    item: 'DG Cement',
    type: 'issue',
    quantity: 25,
    date: '2026-08-12',
  },
];

export const SEED_BILLING: Record<string, Billing> = {
  [TENANT_1]: {
    tenantId: TENANT_1,
    plan: 'pro',
    projectLimit: 10,
    currentProjects: 1,
  },
  [TENANT_2]: {
    tenantId: TENANT_2,
    plan: 'basic',
    projectLimit: 1,
    currentProjects: 1,
  },
};