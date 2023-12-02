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
import { UnitsService } from '../services';
import { CreateUnitDto } from '../dto';
import { GetUser } from '~modules/auth/decorators';
import { ResponseBuilder } from '~common/response.builder';

@Controller('units')
export class UnitsController {
  private logger: Logger = new Logger(UnitsController.name);

  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  async createUnit(
    @Body() data: CreateUnitDto,
    @GetUser('bumdesId') bumdesId: string,
  ) {
    const result = await this.unitsService.createUnit(data, bumdesId);

    this.logger.log(
      `Unit created for bumdes '${result.bumdesId}' with unit id '${result.unitId}'`,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.CREATED)
      .setMessage('Unit berhasil dibuat')
      .setData(result)
      .build();
  }

  @Get(':unitId')
  async getUnitById(
    @GetUser('bumdesId') bumdesId: string,
    @Param('unitId') unitId: string,
  ) {
    const result = await this.unitsService.getUnitById(bumdesId, unitId);

    this.logger.log(`Get unit by id '${unitId}' for bumdes '${bumdesId}'`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Unit berhasil ditemukan')
      .setData(result)
      .build();
  }

  @Get()
  async getBumdesUnits(@GetUser('bumdesId') bumdesId: string) {
    const result = await this.unitsService.getUnits(bumdesId);

    this.logger.log(`Get units for bumdes '${bumdesId}'`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Unit berhasil ditemukan')
      .setData(result)
      .build();
  }

  @Delete(':unitId')
  async deleteUnitById(
    @GetUser('bumdesId') bumdesId: string,
    @Param('unitId') unitId: string,
  ) {
    const result = await this.unitsService.deleteUnitById(bumdesId, unitId);

    this.logger.log(`Delete unit by id '${unitId}' for bumdes '${bumdesId}'`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Unit berhasil dihapus')
      .setData(result)
      .build();
  }
}
