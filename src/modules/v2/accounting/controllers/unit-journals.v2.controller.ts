import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { JournalsV2Service } from '../services/journals.v2.service';
import {
  AddJournalV2Dto,
  GetManyJournalsV2Dto,
  UpdateJournalV2Dto,
} from '../dto';
import { GetUser, HasRoles } from '~modules/v1/auth/decorators';
import { JwtUserPayload } from '~modules/v1/auth/types';
import { buildEvidenceValidationPipe } from '~common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUserRole } from '@prisma/client';
import { OptionalCommonDeleteDto } from '~common/dto';
import { DeleteJournalV2Response } from '../responses';

@Controller({
  path: 'units/:unit_id/journals',
  version: '2',
})
@HasRoles(AuthUserRole.UNIT)
export class UnitJournalsV2Controller {
  private logger: Logger = new Logger(UnitJournalsV2Controller.name);

  constructor(private readonly journalsService: JournalsV2Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('evidence'))
  async addJournal(
    @Body() dto: AddJournalV2Dto,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @UploadedFile(buildEvidenceValidationPipe()) evidence?: Express.Multer.File,
  ) {
    if (unitId !== user.unitId) throw new ForbiddenException();

    this.logger.log(`Menambahkan jurnal baru untuk unit ID '${user.unitId}'`);

    const result = await this.journalsService.addJournal(
      dto,
      { unit_id: user.unitId, bumdes_id: user.bumdesId },
      evidence,
    );

    this.logger.log(`Jurnal berhasil ditambahkan dengan ID '${result.id}'`);

    return result;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('evidence'))
  async updateJournal(
    @Body() dto: UpdateJournalV2Dto,
    @Param('id') id: string,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @UploadedFile(buildEvidenceValidationPipe()) evidence?: Express.Multer.File,
  ) {
    if (unitId !== user.unitId) throw new ForbiddenException();

    this.logger.log(`Mengubah jurnal dengan ID '${id}'`);

    const result = await this.journalsService.updateJournal(
      id,
      dto,
      { unit_id: user.unitId, bumdes_id: user.bumdesId },
      evidence,
    );

    this.logger.log(`Data jurnal dengan ID '${id}' berhasil diperbarui`);

    return result;
  }

  @Delete(':id')
  async deleteJournal(
    @Param('id') id: string,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Query() dto?: OptionalCommonDeleteDto,
  ) {
    if (unitId !== user.unitId) throw new ForbiddenException();

    this.logger.log(`Menghapus jurnal dengan ID '${id}'`);

    let result: DeleteJournalV2Response;

    if (dto?.hard_delete) {
      result = await this.journalsService.hardDeleteJournal(id, dto);
    } else {
      result = await this.journalsService.softDeleteJournal(id);
    }

    this.logger.log(`Jurnal dengan ID '${id}' berhasil dihapus`);

    return result;
  }

  @Get(':id')
  async getJournalById(
    @Param('id') id: string,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
  ) {
    if (unitId !== user.unitId) throw new ForbiddenException();

    this.logger.log(`Mengambil jurnal dengan ID '${id}'`);

    const result = await this.journalsService.getJournalById(id);

    this.logger.log(`Jurnal dengan ID '${id}' berhasil diambil`);

    return result;
  }

  @Get()
  async getJournals(
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Query() dto?: GetManyJournalsV2Dto,
  ) {
    if (unitId !== user.unitId) throw new ForbiddenException();

    this.logger.log(`Mengambil daftar jurnal ${JSON.stringify(dto)}`);

    const result = await this.journalsService.getJournals({
      ...dto,
      unit_id: unitId,
    });

    this.logger.log(`Berhasil mengambil ${result._count} jurnal`);

    return result;
  }

  @Get(':id/evidence')
  async getJournalEvidence(
    @Param('id') id: string,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
  ) {
    if (unitId !== user.unitId) throw new ForbiddenException();

    this.logger.log(`Mengambil bukti jurnal dengan ID '${id}'`);

    const result = await this.journalsService.getJournalEvidenceById(id);

    this.logger.log(`Bukti jurnal dengan ID '${id}' berhasil diambil`);

    return result;
  }
}
