import { TenantId } from './ids.js';

export interface TenantScoped {
  readonly tenantId: TenantId;
}