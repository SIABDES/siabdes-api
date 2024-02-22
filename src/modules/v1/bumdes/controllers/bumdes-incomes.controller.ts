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
import { BumdesIncomesService } from '../services';
import {
  AddBumdesIncomeHistoryDto,
  UpdateBumdesIncomeHistoryDto,
} from '../dto';
import { ResponseBuilder } from '~common/response.builder';

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

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.CREATED)
      .setData(result)
      .setMessage('Tambah riwayat pendapatan berhasil')
      .build();
  }

  @Get()
  async getIncomeHistory(@Param('bumdesId') bumdesId: string) {
    const result = await this.incomesService.getHistories(bumdesId);

    this.logger.log(`Get income history for Bumdes ${bumdesId} success`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setData(result)
      .setMessage('Ambil riwayat pendapatan berhasil')
      .build();
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

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setData(result)
      .setMessage('Update riwayat pendapatan berhasil')
      .build();
  }

  @Delete(':incomeId')
  async deleteIncomeHistory(
    @Param('bumdesId') bumdesId: string,
    @Param('incomeId') incomeId: string,
  ) {
    await this.incomesService.deleteHistory(bumdesId, incomeId);

    this.logger.log(`Delete income history for Bumdes ${bumdesId} success`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Hapus riwayat pendapatan berhasil')
      .build();
  }
}
