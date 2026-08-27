import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { z } from 'zod';
import { handlers } from '../mocks/handlers.js';
import { BanaaoClient } from '../api/client.js';
import { TENANT_1, TENANT_2 } from '../mocks/seed.js';
import { ProjectSchema } from '../contract/project.js';
import { can } from '../rbac.js';
import { calculateUdhaar, calculateStockOnHand } from '../ledger.js';
import { Paisa, ProjectId } from '../ids.js';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Banaao Phase 0 Integration & Logic Tests', () => {
  it('fetches project list for tenant and validates response shape', async () => {
    const client = new BanaaoClient('https://api.banaao.pk', TENANT_1);
    const res = await client.get('/projects', z.array(ProjectSchema));

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.length).toBe(1);
      expect(res.value[0]?.name).toBe('Gulberg Plaza Site');
    }
  });

  it('prevents tenant data leaks (Tenant 2 only gets Tenant 2 projects)', async () => {
    const client = new BanaaoClient('https://api.banaao.pk', TENANT_2);
    const res = await client.get('/projects', z.array(ProjectSchema));

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value[0]?.name).toBe('Dream House DHA');
    }
  });

  it('calculates udhaar balance correctly in integer Paisa', () => {
    const txs = [
      { id: '1', type: 'purchase' as const, amount: 10000 as Paisa, date: '2026-08-01' },
      { id: '2', type: 'payment' as const, amount: 4000 as Paisa, date: '2026-08-02' },
    ];
    expect(calculateUdhaar(txs)).toBe(6000);
  });

  it('calculates inventory stock on-hand correctly (25 bags DG Cement problem)', () => {
    const movements = [
      { id: '1', tenantId: TENANT_1, projectId: 'proj-101' as ProjectId, item: 'DG Cement', type: 'receipt' as const, quantity: 100, date: '' },
      { id: '2', tenantId: TENANT_1, projectId: 'proj-101' as ProjectId, item: 'DG Cement', type: 'issue' as const, quantity: 25, date: '' },
    ];
    expect(calculateStockOnHand(movements, 'DG Cement')).toBe(75);
  });

  it('enforces RBAC matrix rules properly', () => {
    expect(can('owner', 'billing:manage')).toBe(true);
    expect(can('worker', 'wallet:write')).toBe(false);
    expect(can('worker', 'inventory:write')).toBe(true);
  });
});