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
} from '@nestjs/common';
import { UnitCapitalsService } from '../services';
import { AddUnitCapitalHistoryDto, UpdateUnitCapitalHistoryDto } from '../dto';
import { ResponseBuilder } from '~common/response.builder';

@Controller('units/:unitId/capitals')
export class UnitCapitalsController {
  private logger: Logger = new Logger(UnitCapitalsController.name);

  constructor(private readonly capitalService: UnitCapitalsService) {}

  @Post()
  async addCapitalHistory(
    @Param('unitId') unitId: string,
    @Body() dto: AddUnitCapitalHistoryDto,
  ) {
    const result = await this.capitalService.addCapitalHistory(unitId, dto);

    this.logger.log(`Added capital history for unit ${unitId}`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Berhasil menambahkan riwayat pemodalan')
      .setStatusCode(HttpStatus.CREATED)
      .build();
  }

  @Get()
  async getCapitalHistories(@Param('unitId') unitId: string) {
    const result = await this.capitalService.getCapitalHistories(unitId);

    this.logger.log(`Get capital histories for unit ${unitId}`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Berhasil mendapatkan riwayat pemodalan')
      .build();
  }

  @Delete(':capitalId')
  async deleteCapitalHistory(
    @Param('unitId') unitId: string,
    @Param('capitalId') capitalId: string,
  ) {
    const result = await this.capitalService.deleteCapitalHistory(
      unitId,
      capitalId,
    );

    this.logger.log(`Deleted capital history ${capitalId} for unit ${unitId}`);

    return new ResponseBuilder()
      .setMessage('Berhasil menghapus riwayat pemodalan')
      .setData(result)
      .build();
  }

  @Put(':capitalId')
  async updateCapitalHistory(
    @Param('unitId') unitId: string,
    @Param('capitalId') capitalId: string,
    @Body() dto: UpdateUnitCapitalHistoryDto,
  ) {
    const result = await this.capitalService.updateCapitalHistory(
      unitId,
      capitalId,
      dto,
    );

    this.logger.log(`Updated capital history ${capitalId} for unit ${unitId}`);

    return new ResponseBuilder()
      .setMessage('Berhasil mengubah riwayat pemodalan')
      .setData(result)
      .build();
  }
}
