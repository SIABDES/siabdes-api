import { createZodDto } from 'nestjs-zod';
import {
  GetAccountsV2Schema,
  GetSubGroupAccountsV2Schema,
} from '../../schemas';

export class GetAccountsV2Dto extends createZodDto(GetAccountsV2Schema) {}

export class GetSubGroupAccountsV2Dto extends createZodDto(
  GetSubGroupAccountsV2Schema.optional(),
) {}
