import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import { IUnitEmployeesService } from '../interfaces';
import {
  AddUnitEmployeeResponse,
  DeleteUnitEmployeeResponse,
  GetUnitEmployeeResponse,
  GetUnitEmployeesResponse,
  UpdateUnitEmployeeResponse,
} from '../types/responses';
import { AddUnitEmployeeDto, UpdateUnitEmployeeDto } from '../dto';

@Injectable()
export class UnitEmployeesService implements IUnitEmployeesService {
  private readonly logger: Logger = new Logger(UnitEmployeesService.name);

  constructor(private prisma: PrismaService) {}

  async addEmployee(
    unitId: string,
    dto: AddUnitEmployeeDto,
  ): Promise<AddUnitEmployeeResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
        select: { id: true },
      });

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      const employee = await this.prisma.unitEmployee.create({
        data: {
          bumdesUnit: { connect: { id: unit.id } },
          name: dto.name,
          gender: dto.gender,
          nik: dto.nik,
          npwp: dto.npwp,
          npwpStatus: dto.npwp_status,
          marriageStatus: dto.marriage_status,
          childrenAmount: dto.children_amount,
          employeeStatus: dto.employee_status,
          employeeType: dto.employee_type,
          startWorkingAt: dto.start_working_at,
        },
        select: { id: true, createdAt: true },
      });

      return { id: employee.id, created_at: employee.createdAt };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException('Unit not found');

        this.logger.error(error);
      }
      throw error;
    }
  }

  async getEmployees(unitId: string): Promise<GetUnitEmployeesResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
        select: { id: true },
      });

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      const employees = await this.prisma.unitEmployee.findMany({
        where: { bumdesUnitId: unit.id, deletedAt: { equals: null } },
      });

      return {
        _count: employees.length,
        employees: employees.map((employee) => ({
          id: employee.id,
          name: employee.name,
          nik: employee.nik,
          employee_type: employee.employeeType,
        })),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException('Unit not found');

        this.logger.error(error);
      }
      throw error;
    }
  }

  async getEmployeeById(
    unitId: string,
    employeeId: string,
  ): Promise<GetUnitEmployeeResponse> {
    const employee = await this.prisma.unitEmployee.findUnique({
      where: {
        id: employeeId,
        bumdesUnitId: unitId,
        deletedAt: { equals: null },
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return {
      id: employee.id,
      name: employee.name,
      gender: employee.gender,
      nik: employee.nik,
      npwp: employee.npwp,
      npwp_status: employee.npwpStatus,
      marriage_status: employee.marriageStatus,
      children_amount: employee.childrenAmount,
      employee_status: employee.employeeStatus,
      employee_type: employee.employeeType,
      start_working_at: employee.startWorkingAt,
    };
  }

  async updateEmployee(
    unitId: string,
    employeeId: string,
    dto: UpdateUnitEmployeeDto,
  ): Promise<UpdateUnitEmployeeResponse> {
    try {
      const employee = await this.prisma.unitEmployee.update({
        where: {
          id: employeeId,
          bumdesUnitId: unitId,
          deletedAt: { equals: null },
        },
        select: { id: true, updatedAt: true },
        data: {
          name: dto.name,
          gender: dto.gender,
          nik: dto.nik,
          npwp: dto.npwp,
          npwpStatus: dto.npwp_status,
          marriageStatus: dto.marriage_status,
          childrenAmount: dto.children_amount,
          employeeStatus: dto.employee_status,
          employeeType: dto.employee_type,
          startWorkingAt: dto.start_working_at,
        },
      });

      return {
        id: employee.id,
        updated_at: employee.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException('Employee not found');

        this.logger.error(error);
      }
      throw error;
    }
  }

  async deleteEmployeeById(
    unitId: string,
    employeeId: string,
  ): Promise<DeleteUnitEmployeeResponse> {
    try {
      const employee = await this.prisma.unitEmployee.update({
        where: { id: employeeId, bumdesUnitId: unitId },
        data: {
          deletedAt: new Date(),
        },
        select: { id: true },
      });

      return {
        id: employee.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException('Employee not found');

        this.logger.error(error);
      }
      throw error;
    }
  }
}
