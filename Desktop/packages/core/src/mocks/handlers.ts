import { http, HttpResponse } from 'msw';
import { SEED_PROJECTS, SEED_VENDORS, SEED_BILLING } from './seed.js';

export const handlers = [
  // GET /projects (Tenant Scoped & Authorized)
  http.get('https://api.banaao.pk/projects', ({ request }) => {
    const tenantId = request.headers.get('X-Tenant-Id');

    if (!tenantId) {
      return HttpResponse.json({ kind: 'unauthorized' }, { status: 401 });
    }

    const projects = SEED_PROJECTS.filter((p) => p.tenantId === tenantId);
    return HttpResponse.json(projects);
  }),

  // GET /vendors
  http.get('https://api.banaao.pk/vendors', ({ request }) => {
    const tenantId = request.headers.get('X-Tenant-Id');

    if (!tenantId) {
      return HttpResponse.json({ kind: 'unauthorized' }, { status: 401 });
    }

    const vendors = SEED_VENDORS.filter((v) => v.tenantId === tenantId);
    return HttpResponse.json(vendors);
  }),

  // POST /projects (Simulate Metering Check 402)
  http.post('https://api.banaao.pk/projects', ({ request }) => {
    const tenantId = request.headers.get('X-Tenant-Id');
    if (!tenantId) return HttpResponse.json({ kind: 'unauthorized' }, { status: 401 });

    const billing = SEED_BILLING[tenantId];
    if (billing && billing.currentProjects >= billing.projectLimit) {
      return HttpResponse.json(
        { kind: 'payment_required', meter: 'projects_exceeded' },
        { status: 402 }
      );
    }

    return HttpResponse.json({ id: 'proj-new', tenantId, name: 'New Site', status: 'planning', budget: 0 });
  }),
];