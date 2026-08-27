import { z } from 'zod';

export const BillingSchema = z.object({
  tenantId: z.string().brand<'TenantId'>(),
  plan: z.enum(['basic', 'pro']),
  projectLimit: z.number().int().positive(),
  currentProjects: z.number().int().nonnegative(),
});

export type Billing = z.infer<typeof BillingSchema>;