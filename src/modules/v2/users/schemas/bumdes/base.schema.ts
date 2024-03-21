import { z } from 'nestjs-zod/z';

export const BumdesCredentialsV2Schema = z.object({
  identifier: z.string().email(),
  password: z.string().min(1),
});

export const BumdesOrganizationV2Schema = z.object({
  leader: z.string().min(1),
  secretary: z.string().min(1),
  treasurer: z.string().min(1),
});

export const BumdesAddressV2Schema = z.object({
  province: z.string().min(1),
  regency: z.string().min(1),
  district: z.string().min(1),
  village: z.string().min(1),
  postal_code: z.string().min(1),
  complete_address: z.string().min(1).optional(),
});

export const BaseBumdesV2Schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: BumdesAddressV2Schema,
});

export const BumdesV2Schema = BaseBumdesV2Schema.extend({
  id: z.string().cuid(),
  organization: BumdesOrganizationV2Schema,
  created_at: z.date(),
});

export type BumdesCredentialsV2Type = z.infer<typeof BumdesCredentialsV2Schema>;
export type BumdesOrganizationV2Type = z.infer<
  typeof BumdesOrganizationV2Schema
>;
export type BumdesAddressV2Type = z.infer<typeof BumdesAddressV2Schema>;
export type BaseBumdesV2Type = z.infer<typeof BaseBumdesV2Schema>;
export type BumdesV2Type = z.infer<typeof BumdesV2Schema>;
