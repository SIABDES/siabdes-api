import { z } from 'nestjs-zod/z';
import {
  BaseBumdesV2Schema,
  BumdesCredentialsV2Schema,
  BumdesOrganizationV2Schema,
} from './base.schema';

export const AddBumdesV2Schema = BumdesCredentialsV2Schema.extend({
  bumdes: BaseBumdesV2Schema,
  organization: BumdesOrganizationV2Schema,
});

export type AddBumdesV2Type = z.infer<typeof AddBumdesV2Schema>;
