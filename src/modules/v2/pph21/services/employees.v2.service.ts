import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientExceptionCode } from '~common/exceptions';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  AddEmployeeV2Dto,
  GetManyEmployeesV2Dto,
  UpdateEmployeeV2Dto,
} from '../dto';
import {
  AddEmployeeV2Response,
  DeleteEmployeeV2Response,
  GetEmployeeByIdV2Response,
  GetEmployeePtkpV2Response,
  GetManyEmployeesV2Response,
  UpdateEmployeeV2Response,
} from '../responses';
import { mapPtkpStatus } from '~common/helpers/ptkp-mapper.helper';
import { OptionalPeriodDto } from '~common/dto';
import { TerV2Service } from './ter.v2.service';

@Injectable()
export class EmployeesV2Service {
  constructor(
    private prisma: PrismaService,
    private readonly terService: TerV2Service,
  ) {}

  async getEmployeePtkpStatus(
    employeeId: string,
    dto?: OptionalPeriodDto,
  ): Promise<GetEmployeePtkpV2Response> {
    const employee = await this.prisma.unitEmployee.findUnique({
      where: { id: employeeId, deletedAt: { equals: null } },
      select: { marriageStatus: true, childrenAmount: true, npwpStatus: true },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const status = mapPtkpStatus(employee);

    const ptkp = await this.prisma.pph21PtkpBoundary.findFirst({
      orderBy: { periodYear: 'desc' },
      where: {
        status: { equals: status },
        periodYear: { lte: dto?.period_years || new Date().getFullYear() },
        periodMonth: { lte: dto?.period_month || new Date().getMonth() + 1 },
      },
      select: { status: true, minimumSalary: true },
    });

    return {
      status,
      boundary_salary: ptkp.minimumSalary.toNumber(),
    };
  }

  async addEmployee(
    unitId: string,
    dto: AddEmployeeV2Dto,
  ): Promise<AddEmployeeV2Response> {
    try {
      const employee = await this.prisma.unitEmployee.create({
        data: {
          name: dto.name,
          gender: dto.gender,
          nik: dto.nik,
          npwp: dto.npwp,
          npwpStatus: dto.npwp_status,
          startWorkingAt: dto.start_working_at,
          employeeType: dto.employee_type,
          employeeStatus: dto.employee_status,
          marriageStatus: dto.marriage_status,
          childrenAmount: dto.children_amount,
          bumdesUnit: { connect: { id: unitId } },
        },
        select: { id: true, createdAt: true },
      });

      return {
        id: employee.id,
        created_at: employee.createdAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.UNIQUE_CONSTRAINT_FAILED) {
          throw new BadRequestException('NIK already exists');
        }
      }
      throw error;
    }
  }

  async updateEmployeeById(
    id: string,
    dto: UpdateEmployeeV2Dto,
  ): Promise<UpdateEmployeeV2Response> {
    try {
      const employee = await this.prisma.unitEmployee.update({
        where: { id },
        data: {
          name: dto.name,
          nik: dto.nik,
          npwp: dto.npwp,
          npwpStatus: dto.npwp_status,
          startWorkingAt: dto.start_working_at,
          employeeType: dto.employee_type,
          employeeStatus: dto.employee_status,
          marriageStatus: dto.marriage_status,
          childrenAmount: dto.children_amount,
        },
        select: { id: true, updatedAt: true },
      });

      return {
        id: employee.id,
        updated_at: employee.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.UNIQUE_CONSTRAINT_FAILED) {
          throw new BadRequestException('NIK already exists');
        }
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND) {
          throw new NotFoundException('Employee not found');
        }
        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        ) {
          throw new NotFoundException('Employee not found');
        }
      }
      throw error;
    }
  }

  async getById(id: string): Promise<GetEmployeeByIdV2Response> {
    const employee = await this.prisma.unitEmployee.findUnique({
      where: { id, deletedAt: { equals: null } },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const ptkpStatus = mapPtkpStatus(employee);

    const ptkp = await this.prisma.pph21PtkpBoundary.findFirst({
      orderBy: { periodYear: 'desc' },
      where: {
        status: { equals: ptkpStatus },
        periodYear: { lte: new Date().getFullYear() },
        periodMonth: { lte: new Date().getMonth() + 1 },
      },
      select: { status: true, minimumSalary: true },
    });

    const ter = await this.terService.getTerByPtkpStatus({
      ptkp_status: ptkpStatus,
      period_month: new Date().getMonth() + 1,
      period_years: new Date().getFullYear(),
    });

    return {
      id: employee.id,
      name: employee.name,
      nik: employee.nik,
      npwp: employee.npwp,
      npwp_status: employee.npwpStatus,
      gender: employee.gender,
      start_working_at: employee.startWorkingAt,
      employee_type: employee.employeeType,
      employee_status: employee.employeeStatus,
      marriage_status: employee.marriageStatus,
      children_amount: employee.childrenAmount,
      ptkp: {
        status: ptkp.status,
        boundary_salary: ptkp.minimumSalary.toNumber(),
      },
      ter,
      created_at: employee.createdAt,
    };
  }

  async getEmployees(
    dto?: GetManyEmployeesV2Dto,
  ): Promise<GetManyEmployeesV2Response> {
    const employees = await this.prisma.unitEmployee.findMany({
      where: {
        name: dto?.name
          ? { contains: dto.name, mode: 'insensitive' }
          : undefined,
        nik: { contains: dto?.nik },
        npwp: { contains: dto?.npwp },
        gender: { equals: dto?.gender },
        marriageStatus: { equals: dto?.marriage_status },
        employeeType: { equals: dto?.employee_type },
        employeeStatus: { equals: dto?.employee_status },
        childrenAmount: { equals: dto?.children_amount },
        deletedAt: { equals: null },
      },
      cursor: dto.cursor ? { id: dto.cursor as string } : undefined,
      skip: dto?.cursor ? 1 : undefined,
      take: dto?.limit,
    });

    return {
      _count: employees.length,
      employees: employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        nik: employee.nik,
        npwp: employee.npwp,
        npwp_status: employee.npwpStatus,
        start_working_at: employee.startWorkingAt,
        employee_type: employee.employeeType,
        employee_status: employee.employeeStatus,
        marriage_status: employee.marriageStatus,
        children_amount: employee.childrenAmount,
        created_at: employee.createdAt,
      })),
    };
  }

  async softDeleteById(id: string): Promise<DeleteEmployeeV2Response> {
    try {
      const employee = await this.prisma.unitEmployee.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: { deletedAt: true },
      });

      return {
        id,
        hard_delete: false,
        deleted_at: employee.deletedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND) {
          throw new NotFoundException('Employee not found');
        }
        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        ) {
          throw new NotFoundException('Employee not found');
        }
      }
      throw error;
    }
  }

  async hardDeleteById(
    id: string,
    force?: boolean,
  ): Promise<DeleteEmployeeV2Response> {
    try {
      const employee = await this.prisma.unitEmployee.delete({
        where: { id, deletedAt: force ? undefined : { not: null } },
        select: { deletedAt: true },
      });

      return {
        id,
        hard_delete: true,
        deleted_at: employee.deletedAt ?? new Date(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND) {
          throw new NotFoundException('Employee not found');
        }
        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        ) {
          throw new NotFoundException('Employee not found');
        }
      }
      throw error;
    }
  }
}
