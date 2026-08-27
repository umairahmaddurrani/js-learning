export * from './ids.js';
export * from './domain.js';
export * from './rbac.js';
export * from './money.js';
export * from './ledger.js';
export * from './metering.js';
export * from './contract/project.js';
export * from './contract/wallet.js';
export * from './contract/vendor.js';
export * from './contract/inventory.js';
export * from './contract/billing.js';
export * from './contract/errors.js';
export * from './api/client.js';

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  budgetPaisa: number;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface VendorLedger {
  tenantId: string;
  vendorName: string;
  balancePaisa: number;
  lastTransaction: string;
}

export interface StockItem {
  tenantId: string;
  name: string;
  quantityOnHand: number;
  unit: string;
}

// Core Money & Tenant Logic (Client Spec Compliant)
export function formatPKR(paisa: number): string {
  return new Intl.NumberFormat('ur-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(paisa / 100);
}

export function filterByTenant<T extends { tenantId: string }>(items: T[], tenantId: string): T[] {
  return items.filter((item) => item.tenantId === tenantId);
}