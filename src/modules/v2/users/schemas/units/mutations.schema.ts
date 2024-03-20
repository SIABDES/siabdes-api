import { BaseUnitV2Schema, UnitCredentialsV2Schema } from './base.schema';

export const CreateUnitV2Schema = BaseUnitV2Schema.partial({
  bumdes_id: true,
}).extend({
  credentials: UnitCredentialsV2Schema,
});
