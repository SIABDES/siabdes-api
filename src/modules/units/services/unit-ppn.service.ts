import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import { PpnFilesService } from '~modules/files_manager/services';
import { AddPpnObjectDto } from '../dto';
import { IUnitPpnService } from '../interfaces';
import { AddPpnTaxResponse, GetPpnTaxesResponse } from '../types/responses';

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
                type: obj.type,
                quantity: obj.quantity,
                pricePerUnit: obj.price,
                // tariff: obj.tariff,
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

  async getPpnTaxes(unitId: string): Promise<GetPpnTaxesResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
        select: { id: true, bumdesId: true },
      });

      if (!unit) throw new NotFoundException('Unit not found');

      const taxes = await this.prisma.ppnTax.findMany({
        where: { bumdesUnitId: unitId },
        include: { objectItems: true },
      });

      return {
        _count: taxes.length,
        taxes: taxes.map((tax) => ({
          id: tax.id,
          given_to: tax.givenTo,
          transaction_date: tax.transactionDate,
          transaction_number: tax.transactionNumber,
          tax_object: tax.object,
          objects: tax.objectItems.map((obj) => ({
            id: obj.id,
            name: obj.name,
            type: obj.type,
            quantity: obj.quantity,
            price: obj.pricePerUnit.toNumber(),
            // tariff: obj.tariff.toNumber(),
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
