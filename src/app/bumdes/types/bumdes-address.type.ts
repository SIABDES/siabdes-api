import { z } from 'zod';

export const BumdesAddressSchema = z.object({
  province: z.string(),
  regency: z.string(),
  district: z.string(),
  subDistrict: z.string(),
  village: z.string(),
  completeAddress: z.string().optional(),
});

export type BumdesAddress = z.infer<typeof BumdesAddressSchema>;
