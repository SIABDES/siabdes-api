import { Prisma } from '@prisma/client';
import {
  Pph21MutationDto,
  isNonEmployee,
  isNonPermanentMonthly,
  isNonPermanentNotMonthly,
  isPermanentEmployee,
} from '~modules/units/dto';
import {
  GrossSalaryCreateInput,
  GrossSalaryUpdateInput,
} from '~modules/units/types';

export function prepareDataByEmployeeType(
  dto: Pph21MutationDto,
): GrossSalaryCreateInput | GrossSalaryUpdateInput {
  const data: Prisma.Pph21TaxUpdateInput | Prisma.Pph21TaxCreateInput = {};

  if (isPermanentEmployee(dto)) {
    data.salary = dto.gross_salary.salary;
    data.allowance = dto.gross_salary.allowance;
    data.thr = dto.gross_salary.thr;
    data.bonus = dto.gross_salary.bonus;
    data.overtimeSalary = dto.gross_salary.overtime_salary;
    data.assurance = dto.gross_salary.assurance;
  }

  if (isNonEmployee(dto)) {
    data.salary = dto.gross_salary.salary;
    data.pkp = dto.gross_salary.pkp;
  }

  if (isNonPermanentMonthly(dto)) {
    data.monthlySalary = dto.gross_salary.monthly_salary;
    data.dailySalary = dto.gross_salary.daily_salary;
    data.workingDays = dto.gross_salary.working_days;
  }

  if (isNonPermanentNotMonthly(dto)) {
    data.salary = dto.gross_salary.salary;
  }

  // TODO: PPh 21 Lainnya belum ada

  return data;
}
