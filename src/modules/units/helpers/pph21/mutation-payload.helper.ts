import { Prisma } from '@prisma/client';
import { UpdateUnitEmployeePph21Dto } from '~modules/units/dto';

export function prepareUpdateData(
  dto: UpdateUnitEmployeePph21Dto,
): Prisma.Pph21TaxUpdateInput {
  return {
    periodMonth: dto.period.month,
    periodYear: dto.period.years,
    pphAmount: dto.result.total_pph21,
    totalSalary: dto.result.total_salary,
    netReceipts: dto.result.net_receipts,
  };
}
