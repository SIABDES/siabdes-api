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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUserRole } from '@prisma/client';
import { PaginationDto } from '~common/dto';
import { buildValidationForEvidence } from '~common/pipes/helpers';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser, HasRoles } from '~modules/auth/decorators';
import {
  CreateJournalDto,
  GetJournalsFilterDto,
  GetJournalsSortDto,
  UpdateJournalDto,
} from '../dto';
import { JournalsService } from '../services';

@HasRoles(AuthUserRole.UNIT)
@Controller('journals')
export class JournalsController {
  private logger: Logger = new Logger(JournalsController.name);
  constructor(private readonly journalsService: JournalsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('evidence'))
  async createJournal(
    @GetUser('unitId') unitId: string,
    @Body() data: CreateJournalDto,
    @UploadedFile(buildValidationForEvidence())
    evidenceFile?: Express.Multer.File,
  ) {
    const result = await this.journalsService.createJournal(
      unitId,
      data,
      evidenceFile,
    );

    this.logger.log(`Jurnal berhasil dibuat dengan id: ${result.id}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.CREATED)
      .setMessage('Jurnal berhasil dibuat')
      .setData(result)
      .build();
  }

  @Get()
  async getJournals(
    @GetUser('unitId') unitId: string,
    @Query() filter?: GetJournalsFilterDto,
    @Query() sort?: GetJournalsSortDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.journalsService.getJournals(
      unitId,
      sort,
      filter,
      pagination,
    );

    this.logger.log(`Jurnal untuk unit id '${unitId}' berhasil didapatkan`);
    this.logger.log(`Query Filter: ${JSON.stringify(filter)}`);
    this.logger.log(`Query Sort: ${JSON.stringify(sort)}`);
    this.logger.log(`Query Pagination: ${JSON.stringify(pagination)}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Jurnal berhasil didapatkan')
      .setData(result)
      .build();
  }

  @Get(':journalId')
  async getJournalDetails(
    @GetUser('unitId') unitId: string,
    @Param('journalId') journalId: string,
  ) {
    const result = await this.journalsService.getJournalDetails(
      unitId,
      journalId,
    );

    this.logger.log(`Detail jurnal berhasil didapatkan pada id '${result.id}'`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Detail jurnal berhasil didapatkan')
      .setData(result)
      .build();
  }

  @Put(':journalId')
  @UseInterceptors(FileInterceptor('evidence'))
  async updateJournal(
    @GetUser('unitId') unitId: string,
    @Param('journalId') journalId: string,
    @Body() data: UpdateJournalDto,
    @UploadedFile(buildValidationForEvidence())
    evidenceFile?: Express.Multer.File,
  ) {
    const result = await this.journalsService.updateJournal(
      unitId,
      journalId,
      data,
      evidenceFile,
    );

    this.logger.log(`Jurnal berhasil diupdate pada journal id '${result.id}'`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Jurnal berhasil diupdate')
      .setData(result)
      .build();
  }

  @Delete(':journalId')
  async deleteJournal(
    @GetUser('unitId') unitId: string,
    @Param('journalId') journalId: string,
  ) {
    const result = await this.journalsService.deleteJournal(unitId, journalId);

    this.logger.log(
      `Jurnal berhasil soft delete pada journal id '${result.id}' `,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Jurnal berhasil dihapus')
      .setData(result)
      .build();
  }
}
