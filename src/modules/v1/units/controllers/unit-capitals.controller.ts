import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddUnitCapitalHistoryDto, UpdateUnitCapitalHistoryDto } from '../dto';
import { UnitCapitalsService } from '../services';

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

    return result;
  }

  @Get()
  async getCapitalHistories(@Param('unitId') unitId: string) {
    const result = await this.capitalService.getCapitalHistories(unitId);

    this.logger.log(`Get capital histories for unit ${unitId}`);

    return result;
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

    return result;
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

    return result;
  }
}
