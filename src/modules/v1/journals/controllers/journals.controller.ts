import {
  Body,
  Controller,
  Delete,
  Get,
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
import { OptionalPaginationDto } from '~common/dto';
import { buildEvidenceValidationPipe } from '~common/pipes';
import { GetUser, HasRoles } from '~modules/v1/auth/decorators';
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
    @UploadedFile(buildEvidenceValidationPipe())
    evidenceFile?: Express.Multer.File,
  ) {
    const result = await this.journalsService.createJournal(
      unitId,
      data,
      evidenceFile,
    );

    this.logger.log(`Jurnal berhasil dibuat dengan id: ${result.id}`);

    return result;
  }

  @Get()
  async getJournals(
    @GetUser('unitId') unitId: string,
    @Query() filter?: GetJournalsFilterDto,
    @Query() sort?: GetJournalsSortDto,
    @Query() pagination?: OptionalPaginationDto,
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

    return result;
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

    return result;
  }

  @Put(':journalId')
  @UseInterceptors(FileInterceptor('evidence'))
  async updateJournal(
    @GetUser('unitId') unitId: string,
    @Param('journalId') journalId: string,
    @Body() data: UpdateJournalDto,
    @UploadedFile(buildEvidenceValidationPipe())
    evidenceFile?: Express.Multer.File,
  ) {
    const result = await this.journalsService.updateJournal(
      unitId,
      journalId,
      data,
      evidenceFile,
    );

    this.logger.log(`Jurnal berhasil diupdate pada journal id '${result.id}'`);

    return result;
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

    return result;
  }
}
