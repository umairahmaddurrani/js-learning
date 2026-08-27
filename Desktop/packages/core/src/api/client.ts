import { ZodType } from 'zod';
import { TenantId } from '../ids.js';
import { Result, ApiError } from '../contract/errors.js';

export class BanaaoClient {
  constructor(
    private readonly baseUrl: string,
    private readonly tenantId: TenantId
  ) {}

  async get<T>(path: string, schema: ZodType<T>): Promise<Result<T, ApiError>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: {
          'X-Tenant-Id': this.tenantId,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) return { ok: false, error: { kind: 'unauthorized' } };
      if (res.status === 402) return { ok: false, error: { kind: 'payment_required', meter: 'limit' } };
      if (res.status === 403) return { ok: false, error: { kind: 'forbidden', need: 'project:write' } };

      const json: unknown = await res.json();
      const parsed = schema.safeParse(json);

      if (!parsed.success) {
        return {
          ok: false,
          error: {
            kind: 'validation',
            issues: parsed.error.issues.map((i) => i.message),
          },
        };
      }

      return { ok: true, value: parsed.data };
    } catch (err) {
      return {
        ok: false,
        error: { kind: 'network', message: err instanceof Error ? err.message : 'Unknown error' },
      };
    }
  }
}