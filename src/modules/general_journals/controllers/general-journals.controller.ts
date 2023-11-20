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
} from '@nestjs/common';
import { GeneralJournalsService } from '../services';
import { GeneralJournalCreateTransactionDto } from '../dto';
import { GetUser, HasRoles } from '~modules/auth/decorators';
import { ResponseBuilder } from '~common/response.builder';
import { AuthUserRole } from '@prisma/client';
import { GeneralJournalUpdateTransactionDto } from '../dto/update-transaction.dto';
import { PaginationDto } from '~common/dto';

@HasRoles(AuthUserRole.UNIT)
@Controller('general_journals')
export class GeneralJournalsController {
  private logger: Logger = new Logger('GeneralJournalsController');

  constructor(
    private readonly generalJournalsService: GeneralJournalsService,
  ) {}

  @Get()
  async getUnitTransactions(
    @GetUser('unitId') unitId: string,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.generalJournalsService.getUnitTransactions(
      unitId,
      pagination,
    );

    this.logger.log(`Get transactions for unit ${unitId}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Transaksi berhasil diambil')
      .setData(result)
      .build();
  }

  @Post()
  async createTransaction(
    @Body() data: GeneralJournalCreateTransactionDto,
    @GetUser('unitId') unitId: string,
  ) {
    const result = await this.generalJournalsService.createTransaction(
      data,
      unitId,
    );

    this.logger.log(
      `Create transaction for unit ${unitId} with description ${data.description}`,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.CREATED)
      .setMessage('Transaksi berhasil dibuat')
      .setData(result)
      .build();
  }

  @Get(':journalId')
  async getTransactionDetails(
    @GetUser('unitId') unitId: string,
    @Param('journalId') journalId: string,
  ) {
    const result = await this.generalJournalsService.getTransactionDetails(
      unitId,
      journalId,
    );

    this.logger.log(
      `Get transaction details for journal ${journalId} for unit ${unitId}`,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Transaksi berhasil diambil')
      .setData(result)
      .build();
  }

  @Delete(':journalId')
  async deleteTransaction(
    @Param('journalId') journalId: string,
    @GetUser('unitId') unitId: string,
  ) {
    const result = await this.generalJournalsService.deleteTransaction(
      unitId,
      journalId,
    );

    this.logger.log(
      `Delete transaction for journal ${journalId} for unit ${unitId}`,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Transaksi berhasil dihapus')
      .setData(result)
      .build();
  }

  @Put(':journalId')
  async updateTransaction(
    @Param('journalId') journalId: string,
    @Body() data: GeneralJournalUpdateTransactionDto,
    @GetUser('unitId') unitId: string,
  ) {
    const result = await this.generalJournalsService.updateTransaction(
      unitId,
      journalId,
      data,
    );

    this.logger.log(
      `Update transaction for journal ${journalId} for unit ${unitId}`,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Transaksi berhasil diupdate')
      .setData(result)
      .build();
  }
}
