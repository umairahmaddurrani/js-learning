import { z } from 'zod';

export const StockMovementSchema = z.object({
  id: z.string(),
  tenantId: z.string().brand<'TenantId'>(),
  projectId: z.string().brand<'ProjectId'>(),
  item: z.string().min(1), // e.g., "DG Cement"
  type: z.enum(['receipt', 'issue']),
  quantity: z.number().int().positive(),
  date: z.string(),
});

export type StockMovement = z.infer<typeof StockMovementSchema>;