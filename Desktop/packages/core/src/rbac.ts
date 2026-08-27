export type Role = 'owner' | 'manager' | 'accountant' | 'worker';

export type Permission =
  | 'wallet:write'
  | 'vendor:write'
  | 'inventory:write'
  | 'billing:manage'
  | 'project:write';

const MATRIX = {
  owner: ['wallet:write', 'vendor:write', 'inventory:write', 'billing:manage', 'project:write'],
  manager: ['wallet:write', 'vendor:write', 'inventory:write', 'project:write'],
  accountant: ['wallet:write', 'vendor:write'],
  worker: ['inventory:write'],
} satisfies Record<Role, readonly Permission[]>;

export function can(role: Role, p: Permission): boolean {
  return (MATRIX[role] as readonly Permission[]).includes(p);
}