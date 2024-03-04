import {
  UnitEmployeeGender,
  UnitEmployeeNpwpStatus,
  UnitEmployeeMarriageStatus,
  UnitEmployeeChildrenAmount,
  UnitEmployeeStatus,
  UnitEmployeeType,
} from '@prisma/client';
import { z } from 'nestjs-zod/z';

const BaseEmployeeV2Schema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  gender: z.enum([UnitEmployeeGender.FEMALE, UnitEmployeeGender.MALE], {
    invalid_type_error: 'Jenis kelamin tidak valid',
    required_error: 'Jenis kelamin tidak boleh kosong',
  }),
  nik: z.string().min(1, 'NIK tidak boleh kosong'),
  start_working_at: z
    .dateString({
      invalid_type_error: 'Tanggal mulai bekerja tidak valid',
      required_error: 'Tanggal mulai bekerja tidak boleh kosong',
    })
    .or(z.date()),
  npwp: z.string().min(1, 'NPWP tidak boleh string kosong').optional(),
  npwp_status: z
    .enum(
      [
        UnitEmployeeNpwpStatus.MERGED_WITH_HUSBAND,
        UnitEmployeeNpwpStatus.SEPARATED_WITH_HUSBAND,
      ],
      {
        invalid_type_error: 'Status NPWP tidak valid',
        required_error: 'Status NPWP tidak boleh kosong',
      },
    )
    .optional(),
  marriage_status: z
    .enum(
      [
        UnitEmployeeMarriageStatus.MARRIED,
        UnitEmployeeMarriageStatus.NOT_MARRIED,
      ],
      {
        invalid_type_error: 'Status pernikahan tidak valid',
        required_error: 'Status pernikahan tidak boleh kosong',
      },
    )
    .optional(),
  children_amount: z.enum(
    [
      UnitEmployeeChildrenAmount.NONE,
      UnitEmployeeChildrenAmount.ONE,
      UnitEmployeeChildrenAmount.TWO,
      UnitEmployeeChildrenAmount.THREE,
    ],
    {
      invalid_type_error: 'Jumlah tanggungan tidak valid',
      required_error: 'Jumlah tanggungan tidak boleh kosong',
    },
  ),
  employee_status: z.enum([UnitEmployeeStatus.NEW, UnitEmployeeStatus.OLD], {
    invalid_type_error: 'Status karyawan tidak valid',
    required_error: 'Status karyawan tidak boleh kosong',
  }),
  employee_type: z.enum(
    [
      UnitEmployeeType.PERMANENT_MONTHLY,
      UnitEmployeeType.NON_EMPLOYEE,
      UnitEmployeeType.NON_PERMANENT_MONTHLY,
      UnitEmployeeType.NON_PERMANENT_NOT_MONTHLY,
      UnitEmployeeType.OTHER_ACTIVITY_MEMBER,
      UnitEmployeeType.OTHER_SUPERVISOR_NON_EMPLOYEE,
      UnitEmployeeType.SEVERANCE_OUTRIGHT,
      UnitEmployeeType.SEVERANCE_PERIODICAL,
    ],
    {
      invalid_type_error: 'Tipe karyawan tidak valid',
      required_error: 'Tipe karyawan tidak boleh kosong',
    },
  ),
});

const FemaleMarriedSchema = BaseEmployeeV2Schema.extend({
  gender: z.literal(UnitEmployeeGender.FEMALE),
  marriage_status: z.literal(UnitEmployeeMarriageStatus.MARRIED),
  npwp_status: z.enum(
    [
      UnitEmployeeNpwpStatus.MERGED_WITH_HUSBAND,
      UnitEmployeeNpwpStatus.SEPARATED_WITH_HUSBAND,
    ],
    {
      invalid_type_error: 'Status NPWP tidak valid',
      required_error:
        'Status NPWP tidak boleh kosong pada karyawan wanita menikah',
    },
  ),
});

const FemaleNotMarriedSchema = BaseEmployeeV2Schema.extend({
  gender: z.literal(UnitEmployeeGender.FEMALE),
  marriage_status: z.literal(UnitEmployeeMarriageStatus.NOT_MARRIED),
  npwp_status: z.undefined({
    invalid_type_error:
      'Status NPWP tidak tersedia pada karyawan wanita tidak menikah',
  }),
});

const FemaleEmployeeSchema = z.discriminatedUnion('marriage_status', [
  FemaleMarriedSchema,
  FemaleNotMarriedSchema,
]);

const MaleEmployeeSchema = BaseEmployeeV2Schema.extend({
  gender: z.literal(UnitEmployeeGender.MALE),
  npwp_status: z.undefined({
    invalid_type_error: 'Status NPWP tidak tersedia pada karyawan pria',
  }),
});

const EmployeeV2Schema = z.union([MaleEmployeeSchema, FemaleEmployeeSchema]);

type BaseEmployeeV2Type = z.infer<typeof BaseEmployeeV2Schema>;
type EmployeeV2Type = z.infer<typeof EmployeeV2Schema>;

export {
  BaseEmployeeV2Schema,
  EmployeeV2Schema,
  BaseEmployeeV2Type,
  EmployeeV2Type,
};
