import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  AddUnitEmployeePph21Dto,
  UpdateUnitEmployeePph21Dto,
} from '../dto/pph21';
import { prepareDataByEmployeeType, prepareUpdateData } from '../helpers';
import { IUnitPph21Service } from '../interfaces';
import { GrossSalaryCreateInput } from '../types';
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
    taxId: string,
  ): Promise<GetUnitEmployeeTaxResponse> {
    try {
      const tax = await this.prisma.pph21Tax.findUnique({
        where: { bumdesUnitId: unitId, id: taxId, deletedAt: { equals: null } },
      });

      if (!tax) throw new NotFoundException('PPh21 tidak ditemukan');

      return {
        id: tax.id,
        gross_salary: {
          allowance: tax.allowance.toNumber(),
          assurance: tax.assurance.toNumber(),
          bonus: tax.bonus.toNumber(),
          overtime_salary: tax.overtimeSalary.toNumber(),
          salary: tax.salary.toNumber(),
          thr: tax.thr.toNumber(),
        },
        result: {
          net_receipts: tax.netReceipts.toNumber(),
          total_pph21: tax.pphAmount.toNumber(),
          total_salary: tax.totalSalary.toNumber(),
        },
        period: {
          month: tax.periodMonth,
          years: tax.periodYear,
        },
      };
    } catch (error) {
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
          employee_type: tax.employee.employeeType,
          name: tax.employee.name,
          nik: tax.employee.nik,
          npwp: tax.employee.npwp,
          status: tax.employee.employeeStatus,
          gross_salary: tax.totalSalary.toNumber(),
          pph21: tax.pphAmount.toNumber(),
          period: {
            month: tax.periodMonth,
            years: tax.periodYear,
          },
        };
      }),
    };
  }

  async updateTax(
    taxId: string,
    dto: UpdateUnitEmployeePph21Dto,
  ): Promise<UpdateUnitEmployeePph21Response> {
    const updateData: Prisma.Pph21TaxUpdateInput = prepareUpdateData(dto);

    try {
      const tax = await this.prisma.pph21Tax.update({
        where: { id: taxId, deletedAt: { equals: null } },
        select: { id: true, updatedAt: true },
        data: {
          ...updateData,
          ...prepareDataByEmployeeType(dto),
        },
      });

      return {
        id: tax.id,
        updated_at: tax.updatedAt,
      };
    } catch (error) {
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
      const grossData: GrossSalaryCreateInput = prepareDataByEmployeeType(
        dto,
      ) as GrossSalaryCreateInput;

      const args: Prisma.Pph21TaxCreateArgs = {
        select: { id: true, createdAt: true },
        data: {
          employee: { connect: { id: employeeId } },
          bumdesUnit: { connect: { id: unitId } },
          netReceipts: dto.result.net_receipts,
          pphAmount: dto.result.total_pph21,
          totalSalary: dto.result.total_salary,
          periodMonth: dto.period.month,
          periodYear: dto.period.years,
          ...grossData,
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
