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
import { OptionalCommonDeleteDto } from '~common/dto';
import { ResponseBuilder } from '~common/response.builder';
import { HasRoles } from '~modules/v1/auth/decorators';
import {
  AddJournalV2Dto,
  GetManyJournalsV2Dto,
  UpdateJournalV2Dto,
} from '../dto';
import { DeleteJournalV2Response } from '../responses';
import { JournalsV2Service } from '../services/journals.v2.service';
import { buildValidationForEvidence } from '~common/pipes/helpers';

@Controller({
  path: 'journals',
  version: '2',
})
export class JournalsV2Controller {
  private readonly logger: Logger = new Logger(JournalsV2Controller.name);

  constructor(private readonly journalsService: JournalsV2Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('evidence'))
  @HasRoles(AuthUserRole.UNIT)
  async addJournal(
    @Body() dto: AddJournalV2Dto,
    @UploadedFile(buildValidationForEvidence()) evidence?: Express.Multer.File,
  ) {
    this.logger.log(`Menambahkan jurnal baru untuk unit ID '${dto.unit_id}'`);

    const result = await this.journalsService.addJournal(dto, evidence);

    this.logger.log(`Jurnal berhasil ditambahkan dengan ID '${result.id}'`);

    return new ResponseBuilder({
      data: result,
      message: 'Jurnal berhasil ditambahkan',
      statusCode: HttpStatus.CREATED,
    }).build();
  }

  @Get(':id')
  async getJournalById(@Param('id') id: string) {
    this.logger.log(`Mengambil jurnal dengan ID '${id}'`);

    const result = await this.journalsService.getJournalById(id);

    this.logger.log(`Jurnal dengan ID '${id}' berhasil diambil`);

    return new ResponseBuilder({
      data: result,
      message: 'Jurnal berhasil diambil',
      statusCode: HttpStatus.OK,
    }).build();
  }

  @Get()
  async getJournals(@Query() dto?: GetManyJournalsV2Dto) {
    this.logger.log(`Mengambil daftar jurnal ${JSON.stringify(dto)}`);

    const result = await this.journalsService.getJournals(dto);

    this.logger.log(`Berhasil mengambil ${result._count} jurnal`);

    return new ResponseBuilder({
      data: result,
      message: 'Daftar jurnal berhasil diambil',
      statusCode: HttpStatus.OK,
    }).build();
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('evidence'))
  @HasRoles(AuthUserRole.UNIT)
  async updateJournal(
    @Body() dto: UpdateJournalV2Dto,
    @Param('id') id: string,
    @UploadedFile(buildValidationForEvidence()) evidence?: Express.Multer.File,
  ) {
    this.logger.log(`Mengubah jurnal dengan ID '${id}'`);

    const result = await this.journalsService.updateJournal(id, dto, evidence);

    this.logger.log(`Data jurnal dengan ID '${id}' berhasil diperbarui`);

    return new ResponseBuilder({
      data: result,
      message: 'Jurnal berhasil diubah',
      statusCode: HttpStatus.OK,
    }).build();
  }

  @Delete(':id')
  @HasRoles(AuthUserRole.UNIT)
  async deleteJournal(
    @Param('id') id: string,
    @Query() dto?: OptionalCommonDeleteDto,
  ) {
    this.logger.log(`Menghapus jurnal dengan ID '${id}'`);

    let result: DeleteJournalV2Response;

    if (dto?.hard_delete) {
      result = await this.journalsService.hardDeleteJournal(id, dto);
    } else {
      result = await this.journalsService.softDeleteJournal(id);
    }

    this.logger.log(`Jurnal dengan ID '${id}' berhasil dihapus`);

    return new ResponseBuilder({
      data: result,
      message: 'Jurnal berhasil dihapus',
      statusCode: HttpStatus.OK,
    }).build();
  }
}
