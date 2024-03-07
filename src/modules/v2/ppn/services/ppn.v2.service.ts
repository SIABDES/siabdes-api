import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BumdesIdsDto } from '~common/dto';
import { CommonDeleteDto } from '~common/dto/delete.dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AddPpnV2Dto, EditPpnV2Dto, OptionalGetManyPpnV2Dto } from '../dto';
import {
  AddPpnV2Response,
  DeletePpnV2Response,
  EditPpnV2Response,
  GetPpnByIdV2Response,
  GetPpnListV2Response,
} from '../responses';
import { PpnFileV2Service } from './ppn-file.v2.service';

@Injectable()
export class PpnV2Service {
  constructor(
    private prisma: PrismaService,
    private readonly fileService: PpnFileV2Service,
  ) {}

  async getById(ppnId: string): Promise<GetPpnByIdV2Response> {
    const ppn = await this.prisma.ppnTax.findUnique({
      where: { id: ppnId, deletedAt: { equals: null } },
      include: { objectItems: true },
    });

    if (!ppn) throw new NotFoundException('Data PPN tidak ditemukan');

    return {
      id: ppn.id,
      transaction_date: ppn.transactionDate,
      given_to: ppn.givenTo,
      item_type: ppn.itemType,
      transaction_number: ppn.transactionNumber,
      transaction_type: ppn.transactionType,
      tax_object: ppn.object,
      created_at: ppn.createdAt,
      object_items: ppn.objectItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.pricePerUnit.toNumber(),
        discount: item.discountPrice.toNumber(),
        total_price: item.totalPrice.toNumber(),
        dpp: item.dpp.toNumber(),
        ppn: item.ppn.toNumber(),
      })),
    };
  }

  async getListPpn(
    dto?: OptionalGetManyPpnV2Dto,
  ): Promise<GetPpnListV2Response> {
    const { unit_id, bumdes_id } = dto;

    const whereQuery: Prisma.PpnTaxWhereInput = {
      deletedAt: { equals: null },
    };

    if (unit_id) whereQuery.bumdesUnitId = unit_id;
    if (bumdes_id) whereQuery.bumdesUnit = { bumdesId: bumdes_id };

    const ppnList = await this.prisma.ppnTax.findMany({
      where: whereQuery,
      include: { objectItems: true },
    });

    return {
      _count: ppnList.length,
      taxes: ppnList.map((ppn) => ({
        id: ppn.id,
        transaction_date: ppn.transactionDate,
        given_to: ppn.givenTo,
        item_type: ppn.itemType,
        transaction_number: ppn.transactionNumber,
        transaction_type: ppn.transactionType,
        tax_object: ppn.object,
        total_dpp: ppn.objectItems.reduce(
          (acc, item) => acc + item.dpp.toNumber(),
          0,
        ),
        total_ppn: ppn.objectItems.reduce(
          (acc, item) => acc + item.ppn.toNumber(),
          0,
        ),
        created_at: ppn.createdAt,
        object_names: ppn.objectItems.map((item) => item.name),
      })),
    };
  }

  async addPpn(
    evidence: Express.Multer.File,
    ids: BumdesIdsDto,
    dto: AddPpnV2Dto,
  ): Promise<AddPpnV2Response> {
    const { key } = await this.fileService.upload(evidence, ids);

    const ppn = await this.prisma.ppnTax.create({
      data: {
        transactionDate: dto.transaction_date,
        givenTo: dto.given_to,
        itemType: dto.item_type,
        transactionType: dto.transaction_type,
        transactionNumber: dto.transaction_number,
        object: dto.tax_object,
        transactionEvidenceKey: key,
        bumdesUnit: { connect: { id: ids.unit_id } },
        objectItems: {
          createMany: {
            data: dto.object_items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              totalPrice: item.total_price,
              discountPrice: item.price - item.discount,
              pricePerUnit: item.price,
              dpp: item.dpp,
              ppn: item.ppn,
            })),
          },
        },
      },
      select: { id: true, createdAt: true },
    });

    return {
      id: ppn.id,
      created_at: ppn.createdAt,
    };
  }

  async softDeleteById(ppnId: string): Promise<DeletePpnV2Response> {
    try {
      const ppn = await this.prisma.ppnTax.update({
        where: { id: ppnId, deletedAt: { equals: null } },
        data: { deletedAt: new Date() },
        select: { id: true, deletedAt: true },
      });

      return {
        id: ppn.id,
        deleted_at: ppn.deletedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Data PPN tidak ditemukan');
        }
      }
      throw error;
    }
  }

  async hardDeleteById(
    ppnId: string,
    deleteDto: CommonDeleteDto,
  ): Promise<DeletePpnV2Response> {
    try {
      if (!deleteDto.hard_delete)
        throw new BadRequestException(
          "Query 'hard_delete' harus bernilai true",
        );

      const ppn = await this.prisma.ppnTax.delete({
        where: {
          id: ppnId,
          deletedAt: deleteDto.force ? undefined : { equals: null },
        },
        select: { id: true },
      });

      return {
        id: ppn.id,
        deleted_at: new Date(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Data PPN tidak ditemukan');
        }
      }
      throw error;
    }
  }

  async editPpnById(
    ppnId: string,
    dto: EditPpnV2Dto,
    evidence?: Express.Multer.File,
  ): Promise<EditPpnV2Response> {
    try {
      const ppn = await this.prisma.ppnTax.findUnique({
        where: { id: ppnId, deletedAt: { equals: null } },
        select: { transactionEvidenceKey: true },
      });

      if (!ppn) throw new NotFoundException('Data PPN tidak ditemukan');

      const { key } = await this.fileService.upload(evidence, {
        key: ppn.transactionEvidenceKey,
      });

      const editPpn = await this.prisma.ppnTax.update({
        where: { id: ppnId, deletedAt: { equals: null } },
        data: {
          transactionDate: dto.transaction_date,
          givenTo: dto.given_to,
          itemType: dto.item_type,
          transactionType: dto.transaction_type,
          transactionNumber: dto.transaction_number,
          object: dto.tax_object,
          transactionEvidenceKey: key,
          objectItems: {
            deleteMany: {},
            createMany: {
              data: dto.object_items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                totalPrice: item.total_price,
                discountPrice: item.price - item.discount,
                pricePerUnit: item.price,
                dpp: item.dpp,
                ppn: item.ppn,
              })),
            },
          },
        },
      });

      return {
        id: editPpn.id,
        updated_at: editPpn.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Data PPN tidak ditemukan');
        }
      }
      throw error;
    }
  }
}
