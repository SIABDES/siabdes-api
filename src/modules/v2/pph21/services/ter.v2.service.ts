import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { mapPtkpStatus } from '~common/helpers/ptkp-mapper.helper';
import { PrismaService } from '~lib/prisma/prisma.service';
import { GetTerV2Dto } from '../dto';
import { GetTerV2Response } from '../responses';

@Injectable()
export class TerV2Service {
  constructor(private prisma: PrismaService) {}

  async getTerByEmployeeId(dto: GetTerV2Dto): Promise<GetTerV2Response> {
    if (!dto.employee_id)
      throw new BadRequestException('Employee id is required');

    const employee = await this.prisma.unitEmployee.findUnique({
      where: { id: dto.employee_id, deletedAt: { equals: null } },
      select: {
        marriageStatus: true,
        childrenAmount: true,
        npwpStatus: true,
        bumdesUnitId: true,
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const status = mapPtkpStatus(employee);

    return await this.getTerByPtkpStatus({
      ...dto,
      ptkp_status: status,
    });
  }

  async getTerByTerType(dto: GetTerV2Dto): Promise<GetTerV2Response> {
    if (!dto.ter_type) throw new BadRequestException('Ptkp status is required');

    const ter = await this.prisma.pph21TerPercentage.findFirst({
      orderBy: { periodYear: 'desc' },
      where: {
        type: { equals: dto.ter_type },
        periodMonth: { lte: dto.period_month },
        periodYear: { lte: dto.period_years },
        rangeStart: { lte: dto.gross_salary },
        rangeEnd: { gte: dto.gross_salary },
      },
    });

    if (!ter) throw new NotFoundException('Ter not found');

    return {
      percentage: ter.percentage.toNumber(),
      type: dto.ter_type,
    };
  }

  async getTerByPtkpStatus(dto: GetTerV2Dto): Promise<GetTerV2Response> {
    if (!dto.ptkp_status)
      throw new BadRequestException('Ptkp status is required');

    const ptkp = await this.prisma.pph21PtkpBoundary.findFirst({
      orderBy: { periodYear: 'desc' },
      where: {
        status: { equals: dto.ptkp_status },
        periodMonth: { lte: dto.period_month },
        periodYear: { lte: dto.period_years },
      },
      select: { terType: true },
    });

    if (!ptkp) throw new NotFoundException('Ptkp not found');

    if (!ptkp.terType)
      return {
        percentage: 0,
        type: ptkp.terType,
      };

    const ter = await this.prisma.pph21TerPercentage.findFirst({
      orderBy: { periodYear: 'desc' },
      where: {
        type: { equals: ptkp.terType },
        periodMonth: { lte: dto.period_month },
        periodYear: { lte: dto.period_years },
        rangeStart: { lte: dto.gross_salary },
        rangeEnd: { gte: dto.gross_salary },
      },
    });

    if (!ter) throw new NotFoundException('Ter not found');

    return {
      percentage: ter.percentage.toNumber(),
      type: ptkp.terType,
    };
  }
}
