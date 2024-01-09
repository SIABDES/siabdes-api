import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import { PpnFilesService } from '~modules/files_manager/services';
import { AddPpnObjectDto, GetPpnTaxesFilterDto } from '../dto';
import { IUnitPpnService } from '../interfaces';
import { AddPpnTaxResponse, GetPpnTaxesResponse } from '../types/responses';
import { PaginationDto } from '~common/dto';

@Injectable()
export class UnitPpnService implements IUnitPpnService {
  private readonly logger: Logger = new Logger(UnitPpnService.name);

  constructor(
    private prisma: PrismaService,
    private filesService: PpnFilesService,
  ) {}

  async addPpnTax(
    unitId: string,
    evidence: Express.Multer.File,
    dto: AddPpnObjectDto,
  ): Promise<AddPpnTaxResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
        select: { id: true, bumdesId: true },
      });

      if (!unit) throw new NotFoundException('Unit not found');

      const evidenceKey = await this.filesService.uploadPpnEvidence(
        unit.id,
        unit.bumdesId,
        evidence,
      );

      const ppnTax = await this.prisma.ppnTax.create({
        select: {
          id: true,
          createdAt: true,
        },
        data: {
          givenTo: dto.given_to,
          object: dto.tax_object,
          itemType: dto.item_type,
          transactionType: dto.transaction_type,
          transactionDate: dto.transaction_date,
          transactionNumber: dto.transaction_number,
          transactionEvidenceKey: evidenceKey,
          bumdesUnit: {
            connect: { id: unitId },
          },
          objectItems: {
            createMany: {
              data: dto.object_items.map((obj) => ({
                name: obj.name,
                quantity: obj.quantity,
                pricePerUnit: obj.price,
                discountPrice: obj.discount,
                totalPrice: obj.total_price,
                dpp: obj.dpp,
                ppn: obj.ppn,
              })),
            },
          },
        },
      });

      return { id: ppnTax.id, created_at: ppnTax.createdAt };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error);
        if (error.code === 'P2002') {
          throw new NotFoundException('Unit not found');
        }
      }
      throw error;
    }
  }

  async getPpnTaxes(
    unitId: string,
    pagination?: PaginationDto,
    filter?: GetPpnTaxesFilterDto,
  ): Promise<GetPpnTaxesResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
        select: { id: true, bumdesId: true },
      });

      if (!unit) throw new NotFoundException('Unit not found');

      const paginationQuery: Prisma.PpnTaxFindManyArgs = {};
      if (pagination) {
        paginationQuery.take = pagination?.limit;
        if (pagination.cursor) {
          paginationQuery.cursor = { id: pagination.cursor as string };
          paginationQuery.skip = 1;
        }
      }

      const where: Prisma.PpnTaxWhereInput = {};

      if (filter) {
        where.transactionDate = filter.transaction_date
          ? { equals: filter.transaction_date }
          : undefined;
        where.transactionNumber = filter.transaction_number
          ? { contains: filter.transaction_number }
          : undefined;
        where.transactionType = filter.transaction_type
          ? { equals: filter.transaction_type }
          : undefined;
        where.givenTo = filter.given_to
          ? { contains: filter.given_to }
          : undefined;
        where.object = filter.tax_object
          ? { equals: filter.tax_object }
          : undefined;
      }

      const taxes = await this.prisma.ppnTax.findMany({
        ...paginationQuery,
        where: { bumdesUnitId: unitId, ...where },
        include: { objectItems: filter.is_detailed },
      });

      return {
        _count: taxes.length,
        taxes: taxes.map((tax) => ({
          id: tax.id,
          given_to: tax.givenTo,
          item_type: tax.itemType,
          transaction_type: tax.transactionType,
          transaction_date: tax.transactionDate,
          transaction_number: tax.transactionNumber,
          tax_object: tax.object,
          objects: !filter.is_detailed
            ? undefined
            : tax.objectItems.map((obj) => ({
                id: obj.id,
                name: obj.name,
                quantity: obj.quantity,
                price: obj.pricePerUnit.toNumber(),
                discount: obj.discountPrice.toNumber(),
                total_price: obj.totalPrice.toNumber(),
                dpp: obj.dpp.toNumber(),
                ppn: obj.ppn.toNumber(),
              })),
        })),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error);
        if (error.code === 'P2002') {
          throw new NotFoundException('Unit not found');
        }
      }
      throw error;
    }
  }
}
