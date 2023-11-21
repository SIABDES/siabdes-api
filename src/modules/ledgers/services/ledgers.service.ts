import { Injectable } from '@nestjs/common';
import { PaginationDto } from '~common/dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  GetLedgerFiltersDto,
  GetLedgerPayloadDto,
  GetLedgerSortDto,
} from '../dto';
import { ILedgersService } from '../interfaces';
import { GetLedgerResponse } from '../types/responses';

@Injectable()
export class LedgersService implements ILedgersService {
  constructor(private prisma: PrismaService) {}

  async getLedger(
    unitId: string,
    data: GetLedgerPayloadDto,
    sort: GetLedgerSortDto,
    filters: GetLedgerFiltersDto,
    pagination?: PaginationDto,
  ): Promise<GetLedgerResponse> {
    throw new Error('Method not implemented.');
  }
}
