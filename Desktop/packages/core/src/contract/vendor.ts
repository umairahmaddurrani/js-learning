import { z } from 'zod';

export const VendorTransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['purchase', 'payment']),
  amount: z.number().int().positive().brand<'Paisa'>(),
  date: z.string(),
});

export const VendorSchema = z.object({
  id: z.string().brand<'VendorId'>(),
  tenantId: z.string().brand<'TenantId'>(),
  name: z.string().min(1),
  phone: z.string(),
  transactions: z.array(VendorTransactionSchema),
});

export type VendorTransaction = z.infer<typeof VendorTransactionSchema>;
export type Vendor = z.infer<typeof VendorSchema>;