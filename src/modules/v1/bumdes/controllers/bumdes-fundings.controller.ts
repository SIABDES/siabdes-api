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
  AddBumdesFundingHistoryDto,
  UpdateBumdesFundingHistoryDto,
} from '../dto';
import { BumdesFundingsService } from '../services';

@Controller('bumdes/:bumdesId/fundings')
export class BumdesFundingsController {
  private logger: Logger = new Logger(BumdesFundingsController.name);

  constructor(private readonly fundingsService: BumdesFundingsService) {}

  @Post()
  async addFundingHistory(
    @Param('bumdesId') bumdesId: string,
    @Body() dto: AddBumdesFundingHistoryDto,
  ) {
    const result = await this.fundingsService.addHistory(bumdesId, dto);

    this.logger.log(`Add funding history for bumdes ${bumdesId}`);

    return result;
  }

  @Get()
  async getFundingHistories(@Param('bumdesId') bumdesId: string) {
    const result = await this.fundingsService.getHistories(bumdesId);

    this.logger.log(`Get funding histories for bumdes ${bumdesId}`);

    return result;
  }

  @Put(':fundingId')
  async updateFundingHistory(
    @Param('bumdesId') bumdesId: string,
    @Param('fundingId') fundingId: string,
    @Body() dto: UpdateBumdesFundingHistoryDto,
  ) {
    const result = await this.fundingsService.updateHistory(
      bumdesId,
      fundingId,
      dto,
    );

    this.logger.log(`Update funding history for bumdes ${bumdesId}`);

    return result;
  }

  @Delete(':fundingId')
  async deleteFundingHistory(
    @Param('bumdesId') bumdesId: string,
    @Param('fundingId') fundingId: string,
  ) {
    const result = await this.fundingsService.deleteHistory(
      bumdesId,
      fundingId,
    );

    this.logger.log(`Delete funding history for bumdes ${bumdesId}`);

    return result;
  }
}
