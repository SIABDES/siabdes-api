import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PpnV2Service } from '../services/ppn.v2.service';
import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify';
import { AddPpnV2Dto } from '../dto';
import { ResponseBuilder } from '~common/response.builder';

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
    @UploadedFile() evidence: MemoryStorageFile,
    @Body() dto: AddPpnV2Dto,
  ) {
    const result = await this.ppnService.addPpn(evidence, dto);

    return new ResponseBuilder({
      statusCode: HttpStatus.CREATED,
      message: 'PPN has been added',
      data: result,
    }).build();
  }
}
