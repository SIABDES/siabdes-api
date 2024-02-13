import { UnitEmployeeType } from '@prisma/client';
import { z } from 'nestjs-zod/z';

export const Pph21BasicSalarySchema = z.object({
  salary: z.number().nonnegative(),
});

export const Pph21MonthlySalarySchema = z.object({
  daily_salary: z.number().nonnegative(),
  monthly_salary: z.number().nonnegative(),
  working_days: z.number().nonnegative(),
});

export const Pph21PermanentEmployeeSalarySchema = z.object({
  salary: z.number().nonnegative(),
  thr: z.number().nonnegative(),
  bonus: z.number().nonnegative(),
  allowance: z.number().nonnegative(),
  overtime_salary: z.number().nonnegative(),
  assurance: z.number().nonnegative(),
});

export const Pph21ResultSchema = z.object({
  total_salary: z.number().nonnegative(),
  total_pph21: z.number().nonnegative(),
  net_receipts: z.number().nonnegative(),
});

export const Pph21PkpCalculationsSchema = z
  .object({
    ptkp: z.number().nonnegative().optional(),
    percentage: z.number().nonnegative().optional(),
    amount: z.number().nonnegative(),
    result: z.number().nonnegative(),
  })
  .refine(
    ({ ptkp, percentage }) => {
      return ptkp !== undefined || percentage !== undefined;
    },
    { message: 'ptkp or percentage must be provided' },
  );

export const Pph21TariffSchema = z.object({
  tariff_percentage: z.number().nonnegative(),
  amount: z.number().nonnegative(),
  result: z.number().nonnegative(),
});

export const Pph21CalculationsSchema = z.array(Pph21TariffSchema).min(1);

export const Pph21NetCalculationsSchema = z.object({
  position_deduction: z.number().nonnegative(),
  annual_contribution: z.number().nonnegative(),
  annual_assurance: z.number().nonnegative(),
  result: z.number().nonnegative(),
});

export const Pph21DecemberTaxableResultSchema = z.object({
  current_year_amount: z.number().nonnegative(),
  before_december_amount: z.number().nonnegative(),
});

export const Pph21GrossSalarySchema = Pph21BasicSalarySchema.partial()
  .and(Pph21MonthlySalarySchema.partial())
  .and(Pph21PermanentEmployeeSalarySchema.partial());

export const Pph21MutationSchema = z.object({
  period_month: z.number().int().min(1).max(12),
  period_years: z.number().int().min(1900).max(2100),
  employee_type: z.enum([
    UnitEmployeeType.PERMANENT_MONTHLY,
    UnitEmployeeType.NON_EMPLOYEE,
    UnitEmployeeType.OTHER_ACTIVITY_MEMBER,
    UnitEmployeeType.OTHER_SUPERVISOR_NON_EMPLOYEE,
    UnitEmployeeType.NON_PERMANENT_MONTHLY,
    UnitEmployeeType.NON_PERMANENT_NOT_MONTHLY,
    UnitEmployeeType.SEVERANCE_OUTRIGHT,
    UnitEmployeeType.SEVERANCE_PERIODICAL,
  ]),
  gross_salary: Pph21GrossSalarySchema,
  pkp_calculations: Pph21PkpCalculationsSchema.optional(),
  net_calculations: Pph21NetCalculationsSchema.optional(),
  pph21_calculations: Pph21CalculationsSchema,
  pph21_december_taxable_result: Pph21DecemberTaxableResultSchema.optional(),
  result: Pph21ResultSchema,
});

export type Pph21MutationType = z.infer<typeof Pph21MutationSchema>;
export type Pph21TaxDetails = Pph21MutationType & {
  id: string;
  has_npwp: boolean;
  employee_id: string;
  created_at: Date;
};

export type Pph21TaxOverview = {
  id: string;
  employee_id: string;
  employee_type: UnitEmployeeType;
  name: string;
  nik: string;
  npwp: string;
  period_month: number;
  period_years: number;
  gross_salary: number;
  pph21: number;
  status: string;
};
