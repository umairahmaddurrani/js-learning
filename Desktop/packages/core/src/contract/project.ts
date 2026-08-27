import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string().brand<'ProjectId'>(),
  tenantId: z.string().brand<'TenantId'>(),
  name: z.string().min(1),
  status: z.enum(['planning', 'active', 'on_hold', 'done']),
  budget: z.number().int().nonnegative(), // Integer Paisa
});

export type Project = z.infer<typeof ProjectSchema>;

export const CreateProject = ProjectSchema.omit({ id: true, tenantId: true });
export type CreateProject = z.infer<typeof CreateProject>;