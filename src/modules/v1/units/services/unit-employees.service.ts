import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Pph21TerPercentage, Prisma } from '@prisma/client';
import { PaginationDto } from '~common/dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  AddUnitEmployeeDto,
  GetEmployeesFilterDto,
  OptionalTaxesPeriodDto,
  UpdateUnitEmployeeDto,
} from '../dto';
import { isFemale } from '../dto/employees/guards';
import { IUnitEmployeesService } from '../interfaces';
import {
  AddUnitEmployeeResponse,
  DeleteUnitEmployeeResponse,
  GetEmployeeTerResponse,
  GetUnitEmployeePtkpResponse,
  GetUnitEmployeeResponse,
  GetUnitEmployeesResponse,
  UpdateUnitEmployeeResponse,
} from '../types/responses';
import { mapPtkpStatus } from '~common/helpers/ptkp-mapper.helper';

@Injectable()
export class UnitEmployeesService implements IUnitEmployeesService {
  private readonly logger: Logger = new Logger(UnitEmployeesService.name);

  constructor(private prisma: PrismaService) {}

  async getEmployeeTer(
    employeeId: string,
    grossSalary: number,
    taxPeriod?: OptionalTaxesPeriodDto,
  ): Promise<GetEmployeeTerResponse> {
    if (isNaN(grossSalary))
      throw new BadRequestException('Invalid gross salary');

    const employee = await this.prisma.unitEmployee.findUnique({
      where: { id: employeeId },
      select: { marriageStatus: true, npwpStatus: true, childrenAmount: true },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const ptkpStatus = mapPtkpStatus({
      marriageStatus: employee.marriageStatus,
      npwpStatus: employee.npwpStatus,
      childrenAmount: employee.childrenAmount,
    });

    const periodMonth = taxPeriod?.period_month || new Date().getMonth() + 1;
    const periodYear = taxPeriod?.period_years || new Date().getFullYear();

    const ptkp = await this.prisma.pph21PtkpBoundary.findFirst({
      orderBy: {
        periodYear: 'desc',
      },
      where: {
        status: ptkpStatus,
        AND: {
          periodMonth: { lte: periodMonth },
          periodYear: { lte: periodYear },
        },
      },
      select: {
        periodMonth: true,
        periodYear: true,
        minimumSalary: true,
        terType: true,
        status: true,
      },
    });

    if (!ptkp) throw new NotFoundException('PTKP not found');

    const terData = await this.prisma.pph21TerPercentage.findFirst({
      orderBy: {
        periodYear: 'desc',
      },
      where: {
        AND: {
          periodYear: { lte: periodYear },
          periodMonth: { lte: periodMonth },
        },
        type: {
          equals: ptkp.terType,
        },
        rangeStart: { lte: grossSalary },
        rangeEnd: { gte: grossSalary },
      },
      select: { percentage: true },
    });

    if (!terData) throw new NotFoundException('TER not found');

    return {
      type: ptkp.terType,
      percentage: terData.percentage.toNumber(),
    };
  }

  async getEmployeeTaxInfo(
    unitId: string,
    employeeId: string,
    taxPeriod?: OptionalTaxesPeriodDto,
  ): Promise<GetUnitEmployeePtkpResponse> {
    try {
      const employee = await this.prisma.unitEmployee.findUnique({
        where: { id: employeeId, bumdesUnitId: unitId },
        select: {
          gender: true,
          npwpStatus: true,
          employeeType: true,
          childrenAmount: true,
          marriageStatus: true,
        },
      });

      const ptkpStatus = mapPtkpStatus({
        marriageStatus: employee.marriageStatus,
        npwpStatus: employee.npwpStatus,
        childrenAmount: employee.childrenAmount,
      });

      const periodMonth = taxPeriod?.period_month || new Date().getMonth() + 1;
      const periodYear = taxPeriod?.period_years || new Date().getFullYear();

      const ptkp = await this.prisma.pph21PtkpBoundary.findFirst({
        where: {
          AND: {
            periodYear: { lte: periodYear },
            periodMonth: { lte: periodMonth },
          },
          status: ptkpStatus,
        },
        select: { minimumSalary: true, terType: true, status: true },
      });

      if (!ptkp) throw new NotFoundException('PTKP not found');

      let terData: Pph21TerPercentage | null = null;

      if (ptkp.terType) {
        terData = await this.prisma.pph21TerPercentage.findFirst({
          where: {
            periodYear: taxPeriod.period_years,
            periodMonth: taxPeriod.period_month,
            type: {
              equals: ptkp.terType,
            },
          },
        });
      }

      return {
        ptkp: {
          status: ptkpStatus,
          boundary_salary: ptkp.minimumSalary.toNumber(),
        },
        ter: terData && {
          type: ptkp.terType,
          percentage: terData.percentage.toNumber(),
        },
      };
    } catch (error) {
      throw error;
    }
  }

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

      const createData: Prisma.UnitEmployeeCreateInput = {
        bumdesUnit: { connect: { id: unit.id } },
        name: dto.name,
        gender: dto.gender,
        nik: dto.nik,
        npwp: dto.npwp,
        marriageStatus: dto.marriage_status,
        childrenAmount: dto.children_amount,
        employeeStatus: dto.employee_status,
        employeeType: dto.employee_type,
        startWorkingAt: dto.start_working_at,
      };

      if (isFemale(dto)) {
        createData.npwpStatus = dto.npwp_status;
      }

      const employee = await this.prisma.unitEmployee.create({
        data: createData,
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

  async getEmployees(
    unitId: string,
    filter?: GetEmployeesFilterDto,
    pagination?: PaginationDto,
  ): Promise<GetUnitEmployeesResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
        select: { id: true },
      });

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      const whereData: Prisma.UnitEmployeeWhereInput = {
        bumdesUnitId: unit.id,
        deletedAt: { equals: null },
        name: filter?.name
          ? { contains: filter.name, mode: 'insensitive' }
          : undefined,
        nik: filter?.nik ? { contains: filter.nik } : undefined,
        npwp: filter?.npwp ? { contains: filter.npwp } : undefined,
        gender: filter.gender ? { equals: filter.gender } : undefined,
        employeeType: filter.employee_type
          ? { equals: filter.employee_type }
          : undefined,
      };

      const paginationQuery: Prisma.UnitEmployeeFindManyArgs = {
        take: pagination?.limit ?? undefined,
        cursor: pagination?.cursor
          ? {
              id: pagination.cursor as string,
            }
          : undefined,
        skip: pagination.cursor ? 1 : undefined,
      };

      const employees = await this.prisma.unitEmployee.findMany({
        ...paginationQuery,
        where: whereData,
        select: {
          id: true,
          name: true,
          nik: true,
          npwp: true,
          employeeType: true,
        },
      });

      return {
        _count: employees.length,
        employees: employees.map((employee) => ({
          id: employee.id,
          name: employee.name,
          nik: employee.nik,
          npwp: employee.npwp,
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
    taxPeriod?: OptionalTaxesPeriodDto,
  ): Promise<GetUnitEmployeeResponse> {
    const employee = await this.prisma.unitEmployee.findUnique({
      where: {
        id: employeeId,
        bumdesUnitId: unitId,
        deletedAt: { equals: null },
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const taxInfo = await this.getEmployeeTaxInfo(
      unitId,
      employeeId,
      taxPeriod,
    );

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
      ptkp: taxInfo.ptkp,
      ter: taxInfo.ter,
      start_working_at: employee.startWorkingAt,
    };
  }

  async updateEmployee(
    unitId: string,
    employeeId: string,
    dto: UpdateUnitEmployeeDto,
  ): Promise<UpdateUnitEmployeeResponse> {
    try {
      const updateData: Prisma.UnitEmployeeUpdateInput = {
        name: dto.name,
        gender: dto.gender,
        nik: dto.nik,
        npwp: dto.npwp,
        marriageStatus: dto.marriage_status,
        childrenAmount: dto.children_amount,
        employeeStatus: dto.employee_status,
        employeeType: dto.employee_type,
        startWorkingAt: dto.start_working_at,
      };

      if (isFemale(dto)) {
        updateData.npwpStatus = dto.npwp_status;
      }

      const employee = await this.prisma.unitEmployee.update({
        where: {
          id: employeeId,
          bumdesUnitId: unitId,
          deletedAt: { equals: null },
        },
        select: { id: true, updatedAt: true },
        data: updateData,
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
