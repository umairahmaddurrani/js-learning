import { Permission } from '../rbac.js';

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type ApiError =
  | { kind: 'unauthorized' }
  | { kind: 'payment_required'; meter: string }
  | { kind: 'forbidden'; need: Permission }
  | { kind: 'validation'; issues: string[] }
  | { kind: 'network'; message: string };