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
import { CommonDeleteDto } from '~common/dto/delete.dto';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser, HasRoles } from '~modules/v1/auth/decorators';
import { JwtUserPayload } from '~modules/v1/auth/types';
import { AddPpnV2Dto, EditPpnV2Dto, OptionalGetManyPpnV2Dto } from '../dto';
import { DeletePpnV2Response } from '../responses';
import { PpnV2Service } from '../services/ppn.v2.service';

@Controller({
  path: 'ppn',
  version: '2',
})
export class PpnV2Controller {
  private readonly logger: Logger = new Logger(PpnV2Controller.name);

  constructor(private readonly ppnService: PpnV2Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('transaction_evidence'))
  @HasRoles(AuthUserRole.UNIT)
  async addPpn(
    @Body() dto: AddPpnV2Dto,
    @UploadedFile() evidence: Express.Multer.File,
    @GetUser() user: JwtUserPayload,
  ) {
    this.logger.log(`Adding PPN, body: ${JSON.stringify(dto)}`);

    const result = await this.ppnService.addPpn(
      evidence,
      { bumdes_id: user.bumdesId, unit_id: user.unitId },
      dto,
    );

    this.logger.log(
      `PPN has been added, ID: ${result.id}, created_at: ${result.created_at}`,
    );

    return new ResponseBuilder({
      statusCode: HttpStatus.CREATED,
      message: 'PPN has been added',
      data: result,
    }).build();
  }

  @Get()
  async getListPpn(@Query() dto?: OptionalGetManyPpnV2Dto) {
    this.logger.log(`Getting list PPN for unit: ${dto.unit_id}`);

    const result = await this.ppnService.getListPpn(dto);

    this.logger.log(`List PPN has been retrieved`);

    return new ResponseBuilder({
      statusCode: HttpStatus.OK,
      message: 'List PPN has been retrieved',
      data: result,
    }).build();
  }

  @Get(':id')
  async getPpnById(@Param('id') ppnId: string) {
    this.logger.log(`Getting PPN by ID: ${ppnId}`);

    const result = await this.ppnService.getById(ppnId);

    this.logger.log(`PPN has been retrieved`);

    return new ResponseBuilder({
      statusCode: HttpStatus.OK,
      message: 'PPN has been retrieved',
      data: result,
    }).build();
  }

  @Delete(':id')
  @HasRoles(AuthUserRole.UNIT)
  async deletePpn(
    @Param('id') ppnId: string,
    @Query() deleteDto?: CommonDeleteDto,
  ) {
    this.logger.log(`Deleting PPN by ID: ${ppnId}`);

    let result: DeletePpnV2Response;

    if (deleteDto && deleteDto.hard_delete) {
      result = await this.ppnService.hardDeleteById(ppnId, deleteDto);
    } else {
      result = await this.ppnService.softDeleteById(ppnId);
    }

    this.logger.log(`PPN has been deleted`);

    return new ResponseBuilder({
      statusCode: HttpStatus.OK,
      message: 'PPN has been deleted',
      data: result,
    }).build();
  }

  @Put(':id')
  @HasRoles(AuthUserRole.UNIT)
  @UseInterceptors(FileInterceptor('transaction_evidence'))
  async editPpn(
    @Body() dto: EditPpnV2Dto,
    @Param('id') id: string,
    @UploadedFile() evidence?: Express.Multer.File,
  ) {
    this.logger.log(`Editing PPN by ID: ${id}`);

    const result = await this.ppnService.editPpnById(id, dto, evidence);

    this.logger.log(`PPN has been edited`);

    return new ResponseBuilder({
      statusCode: HttpStatus.OK,
      message: 'PPN has been edited',
      data: result,
    }).build();
  }
}
