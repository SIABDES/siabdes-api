import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationDto } from '~common/dto';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser } from '~modules/auth/decorators';
import {
  AdjustmentJournalCreateTransactionDto,
  AdjustmentJournalUpdateTransactionDto,
} from '../dto';
import { AdjustmentJournalsService } from '../services';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('adjustment_journals')
export class AdjustmentJournalsController {
  private logger: Logger = new Logger('AdjustmentJournalsController');

  constructor(
    private readonly adjustmentJournalsService: AdjustmentJournalsService,
  ) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async createTransaction(
    @Body() data: AdjustmentJournalCreateTransactionDto,
    @GetUser('unitId') unitId: string,
  ) {
    const result = await this.adjustmentJournalsService.createTransaction(
      unitId,
      data,
    );

    this.logger.log(`Adjustment journal created: ${result.id}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.CREATED)
      .setMessage('Jurnal penyesuaian berhasil dibuat')
      .setData(result)
      .build();
  }

  @Get(':journalId')
  async getTransactionDetails(@Param('journalId') journalId: string) {
    const result =
      await this.adjustmentJournalsService.getTransactionDetails(journalId);

    this.logger.log(`Adjustment journal found: ${result.id}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Jurnal penyesuaian berhasil ditemukan')
      .setData(result)
      .build();
  }

  @Get()
  async getUnitTransactions(
    @GetUser('unitId') unitId: string,
    @Query() pagination: PaginationDto,
  ) {
    const result = await this.adjustmentJournalsService.getUnitTransactions(
      unitId,
      pagination,
    );

    this.logger.log(`Adjustment journals found: ${result._count} journals`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Jurnal penyesuaian berhasil ditemukan')
      .setData(result)
      .build();
  }

  @Delete(':journalId')
  async deleteTransaction(@Param('journalId') journalId: string) {
    await this.adjustmentJournalsService.deleteTransaction(journalId);

    this.logger.log(`Adjustment journal deleted: ${journalId}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Jurnal penyesuaian berhasil dihapus')
      .setData({
        id: journalId,
      })
      .build();
  }

  @Put(':journalId')
  async updateTransaction(
    @Param('journalId') journalId: string,
    @Body() data: AdjustmentJournalUpdateTransactionDto,
  ) {
    const result = await this.adjustmentJournalsService.updateTransaction(
      journalId,
      data,
    );

    this.logger.log(`Adjustment journal updated: ${journalId}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Jurnal penyesuaian berhasil diupdate')
      .setData(result)
      .build();
  }
}
