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
import { BumdesFundingsService } from '../services';
import {
  AddBumdesFundingHistoryDto,
  UpdateBumdesFundingHistoryDto,
} from '../dto';
import { ResponseBuilder } from '~common/response.builder';

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

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Berhasil menambahkan data pemodalan')
      .setStatusCode(HttpStatus.CREATED)
      .build();
  }

  @Get()
  async getFundingHistories(@Param('bumdesId') bumdesId: string) {
    const result = await this.fundingsService.getHistories(bumdesId);

    this.logger.log(`Get funding histories for bumdes ${bumdesId}`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Berhasil mendapatkan data pemodalan')
      .setStatusCode(HttpStatus.OK)
      .build();
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

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Berhasil mengubah data pemodalan')
      .setStatusCode(HttpStatus.OK)
      .build();
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

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Berhasil menghapus data pemodalan')
      .setStatusCode(HttpStatus.OK)
      .build();
  }
}
