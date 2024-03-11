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
import {
  AddBumdesIncomeHistoryDto,
  UpdateBumdesIncomeHistoryDto,
} from '../dto';
import { BumdesIncomesService } from '../services';

@Controller('bumdes/:bumdesId/incomes')
export class BumdesIncomesController {
  private logger: Logger = new Logger(BumdesIncomesController.name);

  constructor(private readonly incomesService: BumdesIncomesService) {}

  @Post()
  async addIncomeHistory(
    @Param('bumdesId') bumdesId: string,
    @Body() dto: AddBumdesIncomeHistoryDto,
  ) {
    const result = await this.incomesService.addHistory(bumdesId, dto);

    this.logger.log(`Add income history for Bumdes ${bumdesId} success`);

    return result;
  }

  @Get()
  async getIncomeHistory(@Param('bumdesId') bumdesId: string) {
    const result = await this.incomesService.getHistories(bumdesId);

    this.logger.log(`Get income history for Bumdes ${bumdesId} success`);

    return result;
  }

  @Put(':incomeId')
  async updateIncomeHistory(
    @Param('bumdesId') bumdesId: string,
    @Param('incomeId') incomeId: string,
    @Body() dto: UpdateBumdesIncomeHistoryDto,
  ) {
    const result = await this.incomesService.updateHistory(
      bumdesId,
      incomeId,
      dto,
    );

    this.logger.log(`Update income history for Bumdes ${bumdesId} success`);

    return result;
  }

  @Delete(':incomeId')
  async deleteIncomeHistory(
    @Param('bumdesId') bumdesId: string,
    @Param('incomeId') incomeId: string,
  ) {
    await this.incomesService.deleteHistory(bumdesId, incomeId);

    this.logger.log(`Delete income history for Bumdes ${bumdesId} success`);
  }
}
