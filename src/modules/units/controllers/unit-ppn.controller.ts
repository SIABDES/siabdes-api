import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UnitPpnService } from '../services';
import { GetUser } from '~modules/auth/decorators';
import { ResponseBuilder } from '~common/response.builder';
import { AddPpnObjectDto, GetPpnTaxesFilterDto } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { buildValidationForEvidence } from '~common/pipes/helpers';
import { PaginationDto } from '~common/dto';

@Controller('units/:unitId/ppn')
export class UnitPpnController {
  private readonly logger: Logger = new Logger(UnitPpnController.name);

  constructor(private ppnService: UnitPpnService) {}

  @Get()
  async getPpnTaxes(
    @GetUser('unitId') unitId: string,
    @Query() filter?: GetPpnTaxesFilterDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.ppnService.getPpnTaxes(
      unitId,
      pagination,
      filter,
    );

    this.logger.log(`Get ppn taxes for unit ${unitId}`);
    this.logger.log(`Filter: ${JSON.stringify(filter)}`);
    this.logger.log(`Pagination: ${JSON.stringify(pagination)}`);

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