import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  AddUnitEmployeePph21Dto,
  UpdateUnitEmployeePph21Dto,
} from '../dto/pph21';
import { IUnitPph21Service } from '../interfaces';
import {
  AddUnitEmployeePph21Response,
  DeleteUnitEmployeePph21Response,
  GetUnitEmployeeTaxResponse,
  GetUnitEmployeeTaxesResponse,
  UpdateUnitEmployeePph21Response,
} from '../types/responses';

@Injectable()
export class UnitPph21Service implements IUnitPph21Service {
  constructor(private prisma: PrismaService) {}

  async getTaxDetailsById(
    unitId: string,
    employeeId: string,
    taxId: string,
  ): Promise<GetUnitEmployeeTaxResponse> {
    try {
      const employee = await this.prisma.unitEmployee.findUnique({
        where: {
          id: employeeId,
          bumdesUnitId: unitId,
          deletedAt: { equals: null },
        },
        select: { employeeType: true },
      });

      if (!employee) throw new NotFoundException('Karyawan tidak ditemukan');

      const tax = await this.prisma.pph21Tax.findUnique({
        where: { bumdesUnitId: unitId, id: taxId, deletedAt: { equals: null } },
        include: {
          netCalculations: true,
          taxable: true,
          tariffs: true,
          decemberResult: true,
        },
      });

      if (!tax) throw new NotFoundException('PPh21 tidak ditemukan');

      return {
        id: tax.id,
        employee_id: employeeId,
        employee_type: employee.employeeType,
        has_npwp: tax.hasNpwp,
        period_month: tax.periodMonth,
        period_years: tax.periodYear,
        created_at: tax.createdAt,
        gross_salary: {
          salary: tax.salary?.toNumber(),
          allowance: tax.allowance?.toNumber(),
          thr: tax.thr?.toNumber(),
          bonus: tax.bonus?.toNumber(),
          overtime_salary: tax.overtimeSalary?.toNumber(),
          assurance: tax.assurance?.toNumber(),
          working_days: tax.workingDays || undefined,
          monthly_salary: tax.monthlySalary?.toNumber(),
          daily_salary: tax.dailySalary?.toNumber(),
        },
        net_calculations: {
          position_deduction: tax.netCalculations?.positionDeduction.toNumber(),
          annual_assurance: tax.netCalculations?.annualAssurance.toNumber(),
          annual_contribution:
            tax.netCalculations?.annualContribution.toNumber(),
          result: tax.netCalculations?.result.toNumber(),
        },
        pkp_calculations: tax.taxable
          ? {
              ptkp: tax.taxable.ptkp?.toNumber(),
              percentage: tax.taxable.percentage?.toNumber(),
              amount: tax.taxable.amount.toNumber(),
              result: tax.taxable.result.toNumber(),
            }
          : undefined,
        pph21_december_taxable_result: {
          current_year_amount: tax.decemberResult.currentYear.toNumber(),
          before_december_amount: tax.decemberResult.beforeDecember.toNumber(),
        },
        pph21_calculations:
          tax.tariffs.map((t) => ({
            tariff_percentage: t.percentage.toNumber(),
            amount: t.amount.toNumber(),
            result: t.result.toNumber(),
          })) || [],
        result: {
          net_receipts: tax.netReceipts.toNumber(),
          total_pph21: tax.pphAmount.toNumber(),
          total_salary: tax.totalSalary.toNumber(),
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('PPh21 tidak ditemukan');
        }
      }
      throw error;
    }
  }

  async getTaxes(unitId: string): Promise<GetUnitEmployeeTaxesResponse> {
    const taxes = await this.prisma.pph21Tax.findMany({
      where: { bumdesUnitId: unitId, deletedAt: { equals: null } },
      include: { employee: true },
    });

    return {
      _count: taxes.length,
      taxes: taxes.map((tax) => {
        return {
          id: tax.id,
          employee_id: tax.employee.id,
          employee_type: tax.employee.employeeType,
          name: tax.employee.name,
          nik: tax.employee.nik,
          npwp: tax.employee.npwp,
          period_month: tax.periodMonth,
          period_years: tax.periodYear,
          status: tax.employee.employeeStatus,
          gross_salary: tax.totalSalary.toNumber(),
          pph21: tax.pphAmount.toNumber(),
        };
      }),
    };
  }

  async getEmployeesTaxes(
    unitId: string,
    employeeId: string,
  ): Promise<GetUnitEmployeeTaxesResponse> {
    const taxes = await this.prisma.pph21Tax.findMany({
      where: {
        bumdesUnitId: unitId,
        employeeId: employeeId,
        deletedAt: { equals: null },
      },
      include: { employee: true },
    });

    return {
      _count: taxes.length,
      taxes: taxes.map((tax) => {
        return {
          id: tax.id,
          employee_id: tax.employee.id,
          employee_type: tax.employee.employeeType,
          name: tax.employee.name,
          nik: tax.employee.nik,
          npwp: tax.employee.npwp,
          status: tax.employee.employeeStatus,
          period_month: tax.periodMonth,
          period_years: tax.periodYear,
          gross_salary: tax.totalSalary.toNumber(),
          pph21: tax.pphAmount.toNumber(),
        };
      }),
    };
  }

  async updateTax(
    employeeId: string,
    taxId: string,
    dto: UpdateUnitEmployeePph21Dto,
  ): Promise<UpdateUnitEmployeePph21Response> {
    const employee = await this.prisma.unitEmployee.findUnique({
      where: { id: employeeId },
      select: { npwp: true },
    });

    if (!employee)
      throw new NotFoundException('Data tenaga kerja tidak ditemukan');

    const hasNpwp = employee.npwp ? true : false;

    const args: Prisma.Pph21TaxUpdateInput = {
      employeeType: dto.employee_type,
      hasNpwp,
      netReceipts: dto.result.net_receipts,
      pphAmount: dto.result.total_pph21,
      totalSalary: dto.result.total_salary,
      periodMonth: dto.period_month,
      periodYear: dto.period_years,

      tariffs: {
        createMany: {
          data: dto.pph21_calculations.map((tariff) => ({
            percentage: tariff.tariff_percentage,
            amount: tariff.amount,
            result: tariff.result,
          })),
        },
      },

      taxable: dto.pkp_calculations && {
        create: {
          ptkp: dto.pkp_calculations.ptkp,
          percentage: dto.pkp_calculations.percentage,
          amount: dto.pkp_calculations.amount,
          result: dto.pkp_calculations.result,
        },
      },

      netCalculations: dto.net_calculations && {
        create: {
          positionDeduction: dto.net_calculations.position_deduction,
          annualAssurance: dto.net_calculations.annual_assurance,
          annualContribution: dto.net_calculations.annual_contribution,
          result: dto.net_calculations.result,
        },
      },

      decemberResult: dto.pph21_december_taxable_result && {
        create: {
          currentYear: dto.pph21_december_taxable_result.current_year_amount,
          beforeDecember:
            dto.pph21_december_taxable_result.before_december_amount,
        },
      },
    };

    try {
      const tax = await this.prisma.pph21Tax.update({
        where: { id: taxId, deletedAt: { equals: null } },
        select: { id: true, updatedAt: true },
        data: args,
      });

      return {
        id: tax.id,
        updated_at: tax.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Data pajak PPh21 tidak ditemukan');
        }
      }
      throw error;
    }
  }

  async deleteTax(taxId: string): Promise<DeleteUnitEmployeePph21Response> {
    try {
      const tax = await this.prisma.pph21Tax.update({
        where: { id: taxId, deletedAt: { equals: null } },
        select: { id: true, deletedAt: true },
        data: {
          deletedAt: new Date(),
        },
      });

      return {
        id: tax.id,
        deleted_at: tax.deletedAt,
      };
    } catch (error) {
      throw error;
    }
  }

  async addTax(
    unitId: string,
    employeeId: string,
    dto: AddUnitEmployeePph21Dto,
  ): Promise<AddUnitEmployeePph21Response> {
    try {
      const employee = await this.prisma.unitEmployee.findUnique({
        where: { id: employeeId, bumdesUnitId: unitId },
        select: { npwp: true },
      });

      if (!employee)
        throw new NotFoundException('Data tenaga kerja tidak ditemukan');

      const hasNpwp = employee.npwp ? true : false;

      const args: Prisma.Pph21TaxCreateArgs = {
        select: { id: true, createdAt: true },
        data: {
          employee: { connect: { id: employeeId } },
          bumdesUnit: { connect: { id: unitId } },
          employeeType: dto.employee_type,
          hasNpwp,
          netReceipts: dto.result.net_receipts,
          pphAmount: dto.result.total_pph21,
          totalSalary: dto.result.total_salary,
          periodMonth: dto.period_month,
          periodYear: dto.period_years,

          tariffs: {
            createMany: {
              data: dto.pph21_calculations.map((tariff) => ({
                percentage: tariff.tariff_percentage,
                amount: tariff.amount,
                result: tariff.result,
              })),
            },
          },

          taxable: dto.pkp_calculations && {
            create: {
              ptkp: dto.pkp_calculations.ptkp,
              percentage: dto.pkp_calculations.percentage,
              amount: dto.pkp_calculations.amount,
              result: dto.pkp_calculations.result,
            },
          },

          netCalculations: dto.net_calculations && {
            create: {
              positionDeduction: dto.net_calculations.position_deduction,
              annualAssurance: dto.net_calculations.annual_assurance,
              annualContribution: dto.net_calculations.annual_contribution,
              result: dto.net_calculations.result,
            },
          },

          decemberResult: dto.pph21_december_taxable_result && {
            create: {
              currentYear:
                dto.pph21_december_taxable_result.current_year_amount,
              beforeDecember:
                dto.pph21_december_taxable_result.before_december_amount,
            },
          },
        },
      };

      const tax = await this.prisma.pph21Tax.create(args);

      return {
        id: tax.id,
        created_at: tax.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }
}
