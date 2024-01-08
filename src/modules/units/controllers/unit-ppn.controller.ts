import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UnitPpnService } from '../services';
import { GetUser } from '~modules/auth/decorators';
import { ResponseBuilder } from '~common/response.builder';
import { AddPpnObjectDto } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { buildValidationForEvidence } from '~common/pipes/helpers';

@Controller('units/:unitId/ppn')
export class UnitPpnController {
  private readonly logger: Logger = new Logger(UnitPpnController.name);

  constructor(private ppnService: UnitPpnService) {}

  @Get()
  async getPpnTaxes(@GetUser('unitId') unitId: string) {
    const result = await this.ppnService.getPpnTaxes(unitId);

    this.logger.log(`Get ppn taxes for unit ${unitId}`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Berhasil memuat data pajak PPN')
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Post()
  @UseInterceptors(FileInterceptor('transaction_evidence'))
  async addPpnTax(
    @GetUser('unitId') unitId: string,
    @Body() dto: AddPpnObjectDto,
    @UploadedFile(buildValidationForEvidence()) evidence: Express.Multer.File,
  ) {
    const result = await this.ppnService.addPpnTax(unitId, evidence, dto);

    this.logger.log(`Add ppn tax for unit ${unitId}`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Berhasil menambahkan data pajak PPN')
      .setStatusCode(HttpStatus.CREATED)
      .build();
  }
}
