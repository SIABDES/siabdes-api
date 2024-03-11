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
import { AddUnitIncomeHistoryDto, UpdateUnitIncomeHistoryDto } from '../dto';
import { UnitIncomesService } from '../services';

@Controller('units/:unitId/incomes')
export class UnitIncomesController {
  private logger: Logger = new Logger(UnitIncomesController.name);

  constructor(private readonly incomesService: UnitIncomesService) {}

  @Get()
  async getIncomesHistory(@Param('unitId') unitId: string) {
    const result = await this.incomesService.getIncomesHistory(unitId);

    this.logger.log(
      `Successfully retrieve unit incomes history for unit ${unitId}`,
    );

    return result;
  }

  @Post()
  async addIncomeHistory(
    @Param('unitId') unitId: string,
    @Body() dto: AddUnitIncomeHistoryDto,
  ) {
    const result = await this.incomesService.addIncomeHistory(unitId, dto);

    this.logger.log(`Successfully add unit incomes history for unit ${unitId}`);

    return result;
  }

  @Put(':incomeId')
  async updateIncomeHistory(
    @Param('unitId') unitId: string,
    @Param('incomeId') incomeId: string,
    @Body() dto: UpdateUnitIncomeHistoryDto,
  ) {
    const result = await this.incomesService.updateIncomeHistory(
      unitId,
      incomeId,
      dto,
    );

    this.logger.log(
      `Successfully update unit incomes history for unit ${unitId}`,
    );

    return result;
  }

  @Delete(':incomeId')
  async deleteIncomeHistory(
    @Param('unitId') unitId: string,
    @Param('incomeId') incomeId: string,
  ) {
    const result = await this.incomesService.deleteIncomeHistory(
      unitId,
      incomeId,
    );

    this.logger.log(
      `Successfully delete unit incomes history for unit ${unitId}`,
    );

    return result;
  }
}
