import { Prisma, UnitEmployeeType } from '@prisma/client';
import { z } from 'nestjs-zod/z';

export type Pph21TaxDetails = {
  id: string;
  period: {
    month: number;
    years: number;
  };
  gross_salary: {
    salary: number;
    allowance: number;
    thr: number;
    bonus: number;
    overtime_salary: number;
    assurance: number;
  };
  result: {
    total_pph21: number;
    total_salary: number;
    net_receipts: number;
  };
};

export type Pph21EmployeeOverview = {
  id: string;
  employee_id: string;
  name: string;
  nik: string;
  npwp: string;
  employee_type: string;
  period: {
    month: number;
    years: number;
  };
  gross_salary: number;
  pph21: number;
  status: string;
};

export const Pph21PermanentEmployeeSchema = z.object({
  employee_type: z.literal(UnitEmployeeType.PERMANENT_MONTHLY),
  gross_salary: z.object({
    salary: z.number().positive(),
    allowance: z.number().nonnegative(),
    thr: z.number().nonnegative(),
    bonus: z.number().nonnegative(),
    overtime_salary: z.number().nonnegative(),
    assurance: z.number().nonnegative(),
  }),
});
export type Pph21PermanentEmployeeType = z.infer<
  typeof Pph21PermanentEmployeeSchema
>;

export const Pph21NonEmployeeSchema = z.object({
  employee_type: z.literal(UnitEmployeeType.NON_EMPLOYEE),
  gross_salary: z.object({
    salary: z.number().positive(),
    pkp: z.number().nonnegative(),
  }),
});

export type Pph21NonEmployeeType = z.infer<typeof Pph21NonEmployeeSchema>;

export const Pph21SeveranceOutrightSchema = z.object({
  employee_type: z.literal(UnitEmployeeType.SEVERANCE_OUTRIGHT),
  gross_salary: z.object({
    salary: z.number().positive(),
  }),
});

export type Pph21SeveranceOutrightType = z.infer<
  typeof Pph21SeveranceOutrightSchema
>;

export const Pph21SeverancePeriodicalSchema = z.object({
  employee_type: z.literal(UnitEmployeeType.SEVERANCE_PERIODICAL),
  gross_salary: z.object({
    salary: z.number().positive(),
  }),
});

export type Pph21SeverancePeriodicalType = z.infer<
  typeof Pph21SeverancePeriodicalSchema
>;

export const Pph21NonPermanentMonthlySchema = z.object({
  employee_type: z.literal(UnitEmployeeType.NON_PERMANENT_MONTHLY),
  gross_salary: z.object({
    daily_salary: z.number().positive(),
    monthly_salary: z.number().positive(),
    working_days: z.number().int().positive(),
  }),
});

export type Pph21NonPermanentMonthlyType = z.infer<
  typeof Pph21NonPermanentMonthlySchema
>;

export const Pph21NonPermanentNotMonthlySchema = z.object({
  employee_type: z.literal(UnitEmployeeType.NON_PERMANENT_NOT_MONTHLY),
  gross_salary: z.object({
    salary: z.number().positive(),
  }),
});

export type Pph21NonPermanentNotMonthlyType = z.infer<
  typeof Pph21NonPermanentNotMonthlySchema
>;

export const Pph21OtherSupervisorNonEmployeeSchema = z.object({
  employee_type: z.literal(UnitEmployeeType.OTHER_SUPERVISOR_NON_EMPLOYEE),
  gross_salary: z.object({
    salary: z.number().positive(),
  }),
});

export type Pph21OtherSupervisorNonEmployeeType = z.infer<
  typeof Pph21OtherSupervisorNonEmployeeSchema
>;

export const Pph21OtherActivityMemberSchema = z.object({
  employee_type: z.literal(UnitEmployeeType.OTHER_ACTIVITY_MEMBER),
  gross_salary: z.object({
    salary: z.number().positive(),
  }),
});

export type Pph21OtherActivityMemberType = z.infer<
  typeof Pph21OtherActivityMemberSchema
>;

export const Pph21UnionSchema = z.discriminatedUnion('employee_type', [
  Pph21PermanentEmployeeSchema,
  Pph21NonEmployeeSchema,

  Pph21SeveranceOutrightSchema,
  Pph21SeverancePeriodicalSchema,

  Pph21NonPermanentMonthlySchema,
  Pph21NonPermanentNotMonthlySchema,

  Pph21OtherActivityMemberSchema,
  Pph21OtherSupervisorNonEmployeeSchema,
]);

export type GrossSalaryUnusedType = Pick<
  Prisma.Pph21TaxCreateInput | Prisma.Pph21TaxUpdateInput,
  | 'bumdesUnit'
  | 'employee'
  | 'periodMonth'
  | 'periodYear'
  | 'totalSalary'
  | 'pphAmount'
  | 'netReceipts'
>;

export type GrossSalaryUnusedKeys = keyof GrossSalaryUnusedType;

export type GrossSalaryUpdateInput = Omit<
  Prisma.Pph21TaxUpdateInput,
  GrossSalaryUnusedKeys
>;
export type GrossSalaryCreateInput = Omit<
  Prisma.Pph21TaxCreateInput,
  GrossSalaryUnusedKeys
>;
