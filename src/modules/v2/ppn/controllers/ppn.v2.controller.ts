import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PpnV2Service } from '../services/ppn.v2.service';
import { AddPpnV2Dto } from '../dto';
import { ResponseBuilder } from '~common/response.builder';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '~modules/v1/auth/decorators';
import { CommonDeleteDto } from '~common/dto/delete.dto';
import { DeletePpnV2Response } from '../responses';

@Controller({
  path: 'ppn',
  version: '2',
})
export class PpnV2Controller {
  private readonly logger: Logger = new Logger(PpnV2Controller.name);

  constructor(private readonly ppnService: PpnV2Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('transaction_evidence'))
  async addPpn(
    @GetUser('bumdesId') bumdesId: string,
    @GetUser('unitId') unitId: string,
    @UploadedFile() evidence: Express.Multer.File,
    @Body()
    dto: AddPpnV2Dto,
  ) {
    this.logger.log(`Adding PPN, body: ${JSON.stringify(dto)}`);

    const result = await this.ppnService.addPpn(
      evidence,
      { bumdes_id: bumdesId, unit_id: unitId },
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
  async getListPpn(@GetUser('unitId') unitId: string) {
    this.logger.log(`Getting list PPN for unit: ${unitId}`);

    const result = await this.ppnService.getListPpn(unitId);

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
}
