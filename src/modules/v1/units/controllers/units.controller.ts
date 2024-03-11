import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { OptionalPaginationDto } from '~common/dto';
import { GetUser } from '~modules/v1/auth/decorators';
import { CreateUnitDto } from '../dto';
import { UnitsService } from '../services';

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

    return result;
  }

  @Get(':unitId')
  async getUnitById(
    @GetUser('bumdesId') bumdesId: string,
    @Param('unitId') unitId: string,
  ) {
    const result = await this.unitsService.getUnitById(bumdesId, unitId);

    this.logger.log(`Get unit by id '${unitId}' for bumdes '${bumdesId}'`);

    return result;
  }

  @Get()
  async getBumdesUnits(
    @GetUser('bumdesId') bumdesId: string,
    @Query() pagination?: OptionalPaginationDto,
  ) {
    const result = await this.unitsService.getUnits(bumdesId, pagination);

    this.logger.log(`Get units for bumdes '${bumdesId}'`);
    this.logger.log(`Query Pagination: ${JSON.stringify(pagination)}`);

    return result;
  }

  @Delete(':unitId')
  async deleteUnitById(
    @GetUser('bumdesId') bumdesId: string,
    @Param('unitId') unitId: string,
  ) {
    const result = await this.unitsService.deleteUnitById(bumdesId, unitId);

    this.logger.log(`Delete unit by id '${unitId}' for bumdes '${bumdesId}'`);

    return result;
  }

  @Get(':unitId/metadata')
  async getUnitMetadata(@Param('unitId') unitId: string) {
    const result = await this.unitsService.getUnitMetadata(unitId);

    this.logger.log(`Get metadata for unit '${unitId}'`);

    return result;
  }
}
