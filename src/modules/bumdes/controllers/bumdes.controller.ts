import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { BumdesService, BumdesUnitService } from '../services';
import { CreateBumdesUnitDto } from '../dto';
import { ResponseBuilder } from '~common/response.builder';

@Controller('bumdes')
export class BumdesController {
  private logger: Logger = new Logger('BumdesController');

  constructor(
    private readonly bumdesService: BumdesService,
    private readonly bumdesUnitService: BumdesUnitService,
  ) {}

  @Post(':bumdesId/units')
  async createBumdesUnit(
    @Body() data: CreateBumdesUnitDto,
    @Param('bumdesId') bumdesId: string,
  ) {
    const result = await this.bumdesUnitService.createUnit(data, bumdesId);

    this.logger.log(
      `Bumdes unit created for bumdes '${bumdesId}' with unit id '${result}'`,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.CREATED)
      .setMessage('Unit berhasil dibuat')
      .setData(result)
      .build();
  }

  @Delete(':bumdesId/units/:unitId')
  async deleteBumdesUnit(
    @Param('bumdesId') bumdesId: string,
    @Param('unitId') unitId: string,
  ) {
    await this.bumdesUnitService.deleteUnitById(bumdesId, unitId);

    this.logger.log(
      `Bumdes unit deleted for bumdes '${bumdesId}' with unit id '${unitId}'`,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Unit berhasil dihapus')
      .build();
  }

  @Get(':bumdesId/units')
  async getBumdesUnits(@Param('bumdesId') bumdesId: string) {
    const result = await this.bumdesUnitService.getBumdesUnits(bumdesId);

    this.logger.log(`Bumdes units fetched for bumdes '${bumdesId}'`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setData(result)
      .build();
  }

  @Get(':bumdesId/units/:unitId')
  async getBumdesUnitById(
    @Param('bumdesId') bumdesId: string,
    @Param('unitId') unitId: string,
  ) {
    const result = await this.bumdesUnitService.getBumdesUnitById(
      bumdesId,
      unitId,
    );

    this.logger.log(
      `Bumdes unit fetched for bumdes '${bumdesId}' with unit id '${unitId}'`,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setData(result)
      .build();
  }
}
