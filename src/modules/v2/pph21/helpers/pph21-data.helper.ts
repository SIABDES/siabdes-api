import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  isNonPermanentMonthlyEmployee,
  isNormalEmployee,
  isPermanentEmployee,
} from '../schema_guards/pph21.schema.guard';
import { Pph21V2Type } from '../schemas';

type PrepareMode = 'CREATE' | 'UPDATE';

function prepareTariffs(
  dto: Pph21V2Type,
  type: PrepareMode,
  dataQuery: Prisma.Pph21TaxCreateInput | Prisma.Pph21TaxUpdateInput,
) {
  dataQuery.tariffs = {
    deleteMany: type === 'UPDATE' ? {} : undefined,
    createMany: {
      data: dto.pph21_calculations.map((tariff) => ({
        percentage: tariff.tariff_percentage,
        amount: tariff.amount,
        result: tariff.result,
      })),
    },
  };
}

function prepareBaseData(
  dto: Pph21V2Type,
): Prisma.Pph21TaxCreateInput | Prisma.Pph21TaxUpdateInput {
  const dataQuery: Prisma.Pph21TaxCreateInput | Prisma.Pph21TaxUpdateInput = {
    employeeType: dto.employee_type,
    periodMonth: dto.period_month,
    periodYear: dto.period_years,

    // Net Calculations
    netCalculations: dto.net_calculations && {
      create: {
        positionDeduction: dto.net_calculations.position_deduction,
        annualContribution: dto.net_calculations.annual_contribution,
        annualAssurance: dto.net_calculations.annual_assurance,
        result: dto.net_calculations.result,
      },
    },

    // December  Result
    decemberResult: dto.pph21_december_result && {
      create: {
        currentYear: dto.pph21_december_result.current_year,
        beforeDecember: dto.pph21_december_result.before_december,
      },
    },

    // PKP Caculations
    taxable: dto.pkp_calculations && {
      create: {
        ptkp: dto.pkp_calculations.ptkp,
        percentage: dto.pkp_calculations.percentage,
        amount: dto.pkp_calculations.amount,
        result: dto.pkp_calculations.result,
      },
    },

    // Result
    totalSalary: dto.result.total_salary,
    pphAmount: dto.result.total_pph21,
    netReceipts: dto.result.net_receipts,
  };

  // Gross Salary
  if (isPermanentEmployee(dto)) {
    dataQuery.salary = dto.gross_salary.salary;
    dataQuery.bonus = dto.gross_salary.bonus;
    dataQuery.thr = dto.gross_salary.thr;
    dataQuery.allowance = dto.gross_salary.allowance;
    dataQuery.overtimeSalary = dto.gross_salary.overtime_salary;
    dataQuery.assurance = dto.gross_salary.assurance;
  }

  if (isNonPermanentMonthlyEmployee(dto)) {
    dataQuery.workingDays = dto.gross_salary.working_days;
    dataQuery.dailySalary = dto.gross_salary.daily_salary;
    dataQuery.monthlySalary = dto.gross_salary.monthly_salary;
  }

  if (isNormalEmployee(dto)) {
    dataQuery.salary = dto.gross_salary.salary;
  }

  return dataQuery;
}

function isCreate(
  type: PrepareMode,
  dataQuery: Prisma.Pph21TaxCreateInput | Prisma.Pph21TaxUpdateInput,
): dataQuery is Prisma.Pph21TaxCreateInput {
  return type === 'CREATE';
}

export function preparePph21Data(
  dto: Pph21V2Type,
  type: PrepareMode,
  employee?: { unitId: string; npwp?: string },
): Prisma.Pph21TaxCreateInput | Prisma.Pph21TaxUpdateInput {
  const dataQuery = prepareBaseData(dto);

  prepareTariffs(dto, type, dataQuery);

  if (isCreate(type, dataQuery)) {
    if (!employee) throw new BadRequestException('Employee data is required');

    dataQuery.employee = { connect: { id: dto.employee_id } };
    dataQuery.bumdesUnit = {
      connect: {
        id: employee.unitId,
      },
    };
    dataQuery.hasNpwp = !!employee.npwp;
  }

  return dataQuery;
}
