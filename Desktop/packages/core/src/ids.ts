import { z } from 'zod';

export type TenantId = string & z.BRAND<'TenantId'>;
export type ProjectId = string & z.BRAND<'ProjectId'>;
export type VendorId = string & z.BRAND<'VendorId'>;
export type Paisa = number & z.BRAND<'Paisa'>;