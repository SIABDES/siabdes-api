import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OptionalCommonDeleteDto } from '~common/dto';
import { PrismaClientExceptionCode } from '~common/exceptions';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AddPph21V2Dto, EditPph21V2Dto, GetManyPph21V2Dto } from '../dto';
import { preparePph21Data } from '../helpers/pph21-data.helper';
import {
  AddPph21V2Response,
  DeletePph21V2Response,
  GetManyPph21V2Response,
  GetPph21ByIdV2Response,
  UpdatePph21V2Response,
} from '../responses';
import { Pph21OverviewV2Type } from '../types';

@Injectable()
export class Pph21V2Service {
  constructor(private prisma: PrismaService) {}

  async add(dto: AddPph21V2Dto): Promise<AddPph21V2Response> {
    const employee = await this.prisma.unitEmployee.findUnique({
      where: { id: dto.employee_id },
      select: { npwp: true, bumdesUnitId: true },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const dataQuery = preparePph21Data(dto, 'CREATE', {
      unitId: employee.bumdesUnitId,
      npwp: employee.npwp,
    }) as Prisma.Pph21TaxCreateInput;

    const pph21 = await this.prisma.pph21Tax.create({
      data: dataQuery,
      select: { id: true, createdAt: true },
    });

    return {
      id: pph21.id,
      created_at: pph21.createdAt,
    };
  }

  async updateById(
    id: string,
    dto: EditPph21V2Dto,
  ): Promise<UpdatePph21V2Response> {
    const dataQuery = preparePph21Data(
      dto,
      'UPDATE',
    ) as Prisma.Pph21TaxUpdateInput;

    try {
      const pph21 = await this.prisma.pph21Tax.update({
        where: { id, deletedAt: { equals: null } },
        data: dataQuery,
        select: { id: true, updatedAt: true },
      });

      return {
        id: pph21.id,
        updated_at: pph21.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND)
          throw new NotFoundException('Pph21 not found');

        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        )
          throw new NotFoundException('Pph21 not found');
      }
      throw error;
    }
  }

  async getById(id: string): Promise<GetPph21ByIdV2Response> {
    const pph21 = await this.prisma.pph21Tax.findUnique({
      where: { id, deletedAt: { equals: null } },
      include: {
        taxable: true,
        tariffs: true,
        decemberResult: true,
        netCalculations: true,
        employee: true,
      },
    });

    return {
      id: pph21.id,
      employee_id: pph21.employeeId,
      employee_type: pph21.employeeType,
      name: pph21.employee?.name,
      nik: pph21.employee?.nik,
      gender: pph21.employee?.gender,
      has_npwp: pph21.employee?.npwp ? true : false,
      npwp: pph21.employee?.npwp,

      // TODO: PTKP Status & TER Category
      ptkp_status: 'K0',
      ter_category: 'A',

      period_month: pph21.periodMonth,
      period_years: pph21.periodYear,
      created_at: pph21.createdAt,
      gross_salary: {
        salary: pph21.salary?.toNumber(),
        bonus: pph21.bonus?.toNumber(),
        thr: pph21.thr?.toNumber(),
        allowance: pph21.allowance?.toNumber(),
        overtime_salary: pph21.overtimeSalary?.toNumber(),
        assurance: pph21.assurance?.toNumber(),
        working_days: pph21.workingDays || undefined,
        daily_salary: pph21.dailySalary?.toNumber(),
        monthly_salary: pph21.monthlySalary?.toNumber(),
      },
      net_calculations: pph21.netCalculations
        ? {
            position_deduction:
              pph21.netCalculations.positionDeduction.toNumber(),
            annual_contribution:
              pph21.netCalculations.annualContribution.toNumber(),
            annual_assurance: pph21.netCalculations.annualAssurance.toNumber(),
            result: pph21.netCalculations.result.toNumber(),
          }
        : undefined,
      pkp_calculations: pph21.taxable
        ? {
            ptkp: pph21.taxable.ptkp?.toNumber(),
            percentage: pph21.taxable.percentage?.toNumber(),
            amount: pph21.taxable.amount.toNumber(),
            result: pph21.taxable.result.toNumber(),
          }
        : undefined,
      pph21_calculations: pph21.tariffs.map((tariff) => ({
        tariff_percentage: tariff.percentage.toNumber(),
        amount: tariff.amount.toNumber(),
        result: tariff.result.toNumber(),
      })),
      pph21_december_result: pph21.decemberResult
        ? {
            current_year: pph21.decemberResult.currentYear.toNumber(),
            before_december: pph21.decemberResult.beforeDecember.toNumber(),
          }
        : undefined,
      result: {
        total_pph21: pph21.pphAmount.toNumber(),
        total_salary: pph21.totalSalary.toNumber(),
        net_receipts: pph21.netReceipts.toNumber(),
      },
    };
  }

  async getMany(dto?: GetManyPph21V2Dto): Promise<GetManyPph21V2Response> {
    const whereQuery: Prisma.Pph21TaxWhereInput = {
      deletedAt: { equals: null },
      bumdesUnitId: dto.unit_id && { equals: dto.unit_id },
      employeeId: dto.employee_id && { equals: dto.employee_id },
      employeeType: dto.employee_type && {
        equals: dto.employee_type,
      },
      periodMonth: (dto.min_period_month || dto.max_period_years) && {
        gte: dto.min_period_month,
        lte: dto.max_period_month,
      },
      periodYear: (dto.min_period_years || dto.max_period_years) && {
        gte: dto.min_period_years,
        lte: dto.max_period_years,
      },
    };

    const pph21s = await this.prisma.pph21Tax.findMany({
      where: whereQuery,
      include: {
        taxable: true,
        tariffs: true,
        decemberResult: true,
        netCalculations: true,
        employee: true,
      },
    });

    let totalGrossSalary = 0;
    let totalPph21 = 0;

    const taxes: Pph21OverviewV2Type[] = pph21s.map((pph21) => {
      totalGrossSalary += pph21.totalSalary.toNumber();
      totalPph21 += pph21.pphAmount.toNumber();

      return {
        id: pph21.id,
        employee_id: pph21.employeeId,
        employee_type: pph21.employeeType,
        period_month: pph21.periodMonth,
        period_years: pph21.periodYear,
        name: pph21.employee?.name,
        nik: pph21.employee?.nik,
        npwp: pph21.employee?.npwp,
        status: pph21.employee?.employeeStatus,
        gross_salary: pph21.totalSalary.toNumber(),
        pph21: pph21.pphAmount.toNumber(),
      };
    });

    return {
      _count: pph21s.length,
      _total: {
        gross_salary: totalGrossSalary,
        pph21: totalPph21,
        net_salary: totalGrossSalary - totalPph21,
      },
      taxes,
    };
  }

  async softDeleteById(id: string): Promise<DeletePph21V2Response> {
    try {
      const pph21 = await this.prisma.pph21Tax.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: { id: true, deletedAt: true },
      });

      return {
        id: pph21.id,
        deleted_at: pph21.deletedAt,
        hard_delete: false,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND)
          throw new NotFoundException('Pph21 not found');

        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        )
          throw new NotFoundException('Pph21 not found');
      }
      throw error;
    }
  }

  async hardDeleteById(
    id: string,
    dto?: OptionalCommonDeleteDto,
  ): Promise<DeletePph21V2Response> {
    try {
      const pph21 = await this.prisma.pph21Tax.delete({
        where: {
          id,
          deletedAt: dto?.force ? undefined : { not: null },
        },
        select: { id: true, deletedAt: true },
      });

      return {
        id: pph21.id,
        deleted_at: pph21.deletedAt || new Date(),
        hard_delete: true,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND)
          throw new NotFoundException('Pph21 not found');

        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        )
          throw new NotFoundException('Pph21 not found');
      }
      throw error;
    }
  }
}
