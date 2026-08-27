import { z } from 'zod';

export const WalletEntrySchema = z.object({
  id: z.string(),
  tenantId: z.string().brand<'TenantId'>(),
  projectId: z.string().brand<'ProjectId'>(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  amount: z.number().int().positive(), // Integer Paisa
  date: z.string(),
  notes: z.string().optional(),
});

export type WalletEntry = z.infer<typeof WalletEntrySchema>;