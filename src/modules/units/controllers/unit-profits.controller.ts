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
import { UnitProfitsService } from '../services';
import { AddUnitProfitHistoryDto } from '../dto';
import { ResponseBuilder } from '~common/response.builder';

@Controller('units/:unitId/profits')
export class UnitProfitsController {
  private logger: Logger = new Logger(UnitProfitsController.name);

  constructor(private readonly profitsService: UnitProfitsService) {}

  @Post()
  async addProfitHistory(
    @Param('unitId') unitId: string,
    @Body() dto: AddUnitProfitHistoryDto,
  ) {
    const result = await this.profitsService.addProfitHistory(unitId, dto);

    this.logger.log(`Add profit history with unitId: '${unitId}'`);

    return new ResponseBuilder()
      .setMessage(
        `Successfully added profit history for unit with id ${unitId}`,
      )
      .setData(result)
      .setStatusCode(HttpStatus.CREATED)
      .build();
  }

  @Get()
  async getProfitHistories(@Param('unitId') unitId: string) {
    const result = await this.profitsService.getProfitHistories(unitId);

    this.logger.log(`Get profit histories with unitId: '${unitId}'`);

    return new ResponseBuilder()
      .setMessage(
        `Successfully get profit histories for unit with id ${unitId}`,
      )
      .setData(result)
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Put(':profitId')
  async updateProfitHistory(
    @Param('unitId') unitId: string,
    @Param('profitId') profitId: string,
    @Body() dto: AddUnitProfitHistoryDto,
  ) {
    const result = await this.profitsService.updateProfitHistory(
      unitId,
      profitId,
      dto,
    );

    this.logger.log(`Update profit history with unitId: '${unitId}'`);

    return new ResponseBuilder()
      .setMessage(
        `Successfully updated profit history for unit with id ${unitId}`,
      )
      .setData(result)
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Delete(':profitId')
  async deleteProfitHistory(
    @Param('unitId') unitId: string,
    @Param('profitId') profitId: string,
  ) {
    const result = await this.profitsService.deleteProfitHistory(
      unitId,
      profitId,
    );

    this.logger.log(`Delete profit history with unitId: '${unitId}'`);

    return new ResponseBuilder()
      .setMessage(
        `Successfully deleted profit history for unit with id ${unitId}`,
      )
      .setData(result)
      .setStatusCode(HttpStatus.OK)
      .build();
  }
}
