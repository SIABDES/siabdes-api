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
import { PpnV2Service } from '../services';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUserRole } from '@prisma/client';
import { HasRoles, GetUser } from '~modules/v1/auth/decorators';
import { JwtUserPayload } from '~modules/v1/auth/types';
import { AddPpnV2Dto, EditPpnV2Dto, OptionalGetManyPpnV2Dto } from '../dto';
import { CommonDeleteDto } from '~common/dto';
import { DeletePpnV2Response } from '../responses';

@Controller({
  path: 'units/:unit_id/ppn',
  version: '2',
})
@HasRoles(AuthUserRole.UNIT)
export class UnitPpnV2Controller {
  private readonly logger: Logger = new Logger(UnitPpnV2Controller.name);

  constructor(private readonly ppnService: PpnV2Service) {}

  @Get()
  async getListPpn(
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Query() dto?: OptionalGetManyPpnV2Dto,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(`Getting list PPN for unit: ${user.unitId}`);

    const result = await this.ppnService.getListPpn({
      ...dto,
      unit_id: user.unitId,
    });

    this.logger.log(`List PPN has been retrieved`);

    return result;
  }

  @Get(':id')
  async getPpnById(
    @Param('unit_id') unitId: string,
    @Param('id') ppnId: string,
    @GetUser() user: JwtUserPayload,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(`Getting PPN by ID: ${ppnId}`);

    const result = await this.ppnService.getById(ppnId);

    this.logger.log(`PPN has been retrieved`);

    return result;
  }

  @Post()
  @UseInterceptors(FileInterceptor('transaction_evidence'))
  @HasRoles(AuthUserRole.UNIT)
  async addPpn(
    @Body() dto: AddPpnV2Dto,
    @UploadedFile() evidence: Express.Multer.File,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(`Adding PPN for unit ID: ${user.unitId}`);

    const result = await this.ppnService.addPpn(
      evidence,
      { bumdes_id: user.bumdesId, unit_id: user.unitId },
      dto,
    );

    this.logger.log(
      `PPN has been added, ID: ${result.id}, created_at: ${result.created_at}`,
    );

    return result;
  }

  @Delete(':id')
  @HasRoles(AuthUserRole.UNIT)
  async deletePpn(
    @Param('id') ppnId: string,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Query() deleteDto?: CommonDeleteDto,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(`Deleting PPN by ID: ${ppnId}`);

    let result: DeletePpnV2Response;

    if (deleteDto && deleteDto.hard_delete) {
      result = await this.ppnService.hardDeleteById(ppnId, deleteDto);
    } else {
      result = await this.ppnService.softDeleteById(ppnId);
    }

    this.logger.log(`PPN has been deleted`);

    return result;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('transaction_evidence'))
  async editPpn(
    @Body() dto: EditPpnV2Dto,
    @Param('id') id: string,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @UploadedFile() evidence?: Express.Multer.File,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(`Editing PPN by ID: ${id}`);

    const result = await this.ppnService.editPpnById(id, dto, evidence);

    this.logger.log(`PPN has been edited`);

    return result;
  }

  @Get(':id/evidence')
  async getPpnEvidence(@Param('id') ppnId: string) {
    this.logger.log(`Getting evidence for PPN by ID: ${ppnId}`);

    const result = await this.ppnService.getEvidenceById(ppnId);

    this.logger.log(`Evidence has been retrieved`);

    return result;
  }
}
