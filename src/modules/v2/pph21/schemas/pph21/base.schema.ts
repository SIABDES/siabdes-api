import { UnitEmployeeType } from '@prisma/client';
import Decimal from 'decimal.js';
import { z } from 'nestjs-zod/z';
import { AllEmployeeTypeEnumSchema } from '~common/schemas';

const GrossNormalSalaryV2Schema = z.object({
  salary: z.number().nonnegative(),
});

const GrossPermanentEmployeeV2Schema = z.object({
  salary: z.number().nonnegative(),
  allowance: z.number().nonnegative(),
  thr: z.number().nonnegative(),
  bonus: z.number().nonnegative(),
  overtime_salary: z.number().nonnegative(),
  assurance: z.number().nonnegative(),
});

const GrossSalaryMonthlyV2Schema = z
  .object({
    daily_salary: z.number().positive(),
    monthly_salary: z.number().positive(),
    working_days: z
      .number()
      .int()
      .positive({ message: 'Hari kerja harus lebih dari 0' }),
  })
  .refine(
    (data) => {
      const result = new Decimal(data.working_days).times(data.daily_salary);
      return result.equals(data.monthly_salary);
    },
    {
      message:
        'Gaji bulanan harus sama dengan jumlah hari kerja dikali gaji harian',
    },
  );

const GrossSalaryV2Schema = z.union([
  GrossNormalSalaryV2Schema,
  GrossSalaryMonthlyV2Schema,
  GrossPermanentEmployeeV2Schema,
]);

const Pph21TariffV2Schema = z
  .object({
    tariff_percentage: z.number().nonnegative(),
    amount: z.number().nonnegative(),
    result: z.number().nonnegative(),
  })
  .refine(
    (data) => {
      return new Decimal(data.tariff_percentage)
        .times(data.amount)
        .equals(data.result);
    },
    {
      message: 'Perhitungan tarif PPh21 tidak sesuai',
    },
  );

const Pph21CalcuationsV2Schema = z.array(Pph21TariffV2Schema).min(1, {
  message: 'Perhitungan tarif PPh21 tidak boleh kosong',
});

const Pph21ResultV2Schema = z
  .object({
    total_pph21: z.number().nonnegative(),
    total_salary: z.number().nonnegative(),
    net_receipts: z.number().nonnegative(),
  })
  .refine(
    (data) => {
      return new Decimal(data.total_salary)
        .minus(data.total_pph21)
        .equals(data.net_receipts);
    },
    {
      message: 'Perhitungan total gaji dikurangi PPh21 tidak sesuai',
    },
  );

const NetCalculationsV2Schema = z.object({
  position_deduction: z.number().nonnegative(),
  annual_contribution: z.number().nonnegative(),
  annual_assurance: z.number().nonnegative(),
  result: z.number().nonnegative(),
});

const PkpCalculationsV2Schema = z
  .object({
    ptkp: z.number().nonnegative().optional(),
    percentage: z.number().nonnegative().optional(),
    amount: z.number().nonnegative(),
    result: z.number().nonnegative(),
  })
  .refine(
    (data) => {
      return data.ptkp !== undefined || data.percentage !== undefined;
    },
    { message: 'PTKP atau persentase tarif harus diisi' },
  );

const Pph21DecemberResultV2Schema = z.object({
  current_year: z.number().nonnegative(),
  before_december: z.number().nonnegative(),
});

const BasePph21V2Schema = z.object({
  employee_type: AllEmployeeTypeEnumSchema,
  employee_id: z.string().min(1, { message: 'ID karyawan tidak boleh kosong' }),
  period_years: z
    .number()
    .int()
    .min(1900, { message: 'Tahun tidak boleh kurang dari 1900' }),
  period_month: z
    .number()
    .int()
    .min(1, { message: 'Bulan tidak boleh kurang dari 1' })
    .max(12, { message: 'Bulan tidak boleh lebih dari 12' }),
  gross_salary: GrossSalaryV2Schema,
  net_calculations: NetCalculationsV2Schema.optional(),
  pkp_calculations: PkpCalculationsV2Schema.optional(),
  pph21_calculations: Pph21CalcuationsV2Schema,
  pph21_december_result: Pph21DecemberResultV2Schema.optional(),
  result: Pph21ResultV2Schema,
});

const Pph21PermanentEmployeeV2Schema = BasePph21V2Schema.extend({
  employee_type: z.literal(UnitEmployeeType.PERMANENT_MONTHLY),
  gross_salary: GrossPermanentEmployeeV2Schema,
});

const Pph21NonPermanentMonthlyV2Schema = BasePph21V2Schema.extend({
  employee_type: z.literal(UnitEmployeeType.NON_PERMANENT_MONTHLY),
  gross_salary: GrossSalaryMonthlyV2Schema,
});

const Pph21NormalEmployeeV2Schema = BasePph21V2Schema.extend({
  employee_type: AllEmployeeTypeEnumSchema.exclude([
    UnitEmployeeType.PERMANENT_MONTHLY,
    UnitEmployeeType.NON_PERMANENT_MONTHLY,
  ]),
  gross_salary: GrossNormalSalaryV2Schema,
});

const Pph21V2Schema = z.discriminatedUnion('employee_type', [
  Pph21PermanentEmployeeV2Schema,
  Pph21NonPermanentMonthlyV2Schema,
  Pph21NormalEmployeeV2Schema,
]);

type Pph21PermanentEmployeeV2Type = z.infer<
  typeof Pph21PermanentEmployeeV2Schema
>;
type Pph21NonPermanentMonthlyV2Type = z.infer<
  typeof Pph21NonPermanentMonthlyV2Schema
>;
type Pph21NormalEmployeeV2SType = z.infer<typeof Pph21NormalEmployeeV2Schema>;

type Pph21BaseV2Type = z.infer<typeof BasePph21V2Schema>;
type Pph21V2Type = z.infer<typeof Pph21V2Schema>;
type Pph21TariffV2Type = z.infer<typeof Pph21TariffV2Schema>;

export {
  BasePph21V2Schema,
  Pph21V2Schema,
  Pph21BaseV2Type,
  Pph21V2Type,
  Pph21TariffV2Schema,
  Pph21TariffV2Type,
  Pph21PermanentEmployeeV2Type,
  Pph21NonPermanentMonthlyV2Type,
  Pph21NormalEmployeeV2SType,
};
