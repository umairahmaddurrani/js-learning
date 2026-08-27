import { Billing } from './contract/billing.js';

export function isWithinPlanLimit(billing: Billing): boolean {
  return billing.currentProjects < billing.projectLimit;
}