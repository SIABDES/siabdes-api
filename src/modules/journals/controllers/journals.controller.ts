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
import { JournalsService } from '../services';
import { GetUser, HasRoles } from '~modules/auth/decorators';
import {
  CreateJournalDto,
  GetJournalsFilterDto,
  GetJournalsSortDto,
} from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseBuilder } from '~common/response.builder';
import { PaginationDto } from '~common/dto';
import { AuthUserRole } from '@prisma/client';

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
    @UploadedFile() evidenceFile: Express.Multer.File,
  ) {
    const result = await this.journalsService.createJournal(
      unitId,
      evidenceFile,
      data,
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

    this.logger.log(`Jurnal berhasil didapatkan`);

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

    this.logger.log(`Detail jurnal berhasil didapatkan`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Detail jurnal berhasil didapatkan')
      .setData(result)
      .build();
  }

  @Put(':journalId')
  async updateJournal(
    @GetUser('unitId') unitId: string,
    @Param('journalId') journalId: string,
    @Body() data: CreateJournalDto,
  ) {
    const result = await this.journalsService.updateJournal(
      unitId,
      journalId,
      data,
    );

    this.logger.log(`Jurnal berhasil diupdate`);

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

    this.logger.log(`Jurnal berhasil dihapus`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Jurnal berhasil dihapus')
      .setData(result)
      .build();
  }
}
