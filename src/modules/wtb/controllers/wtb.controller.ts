import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { WtbService } from '../services/wtb.service';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser, HasRoles } from '~modules/auth/decorators';
import { AuthUserRole } from '@prisma/client';
import { WtbFilterDto } from '../dto';
import { PaginationDto } from '~common/dto';

@Controller('wtb')
export class WtbController {
  constructor(private readonly wtbService: WtbService) {}

  @Get(':unitId')
  async getWtbForUnit(
    @Param('unitId') unitId: string,
    @Query() filter?: WtbFilterDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.wtbService.getWtbForUnit(
      unitId,
      filter,
      pagination,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Berhasil mengambil data list akun WTB')
      .setData(result)
      .build();
  }

  @Get(':unitId/summary')
  async getWtbSummary(
    @Param('unitId') unitId: string,
    @Query() filter?: WtbFilterDto,
  ) {
    const result = await this.wtbService.getWtbSummary(unitId, filter);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Berhasil mengambil data summary WTB')
      .setData(result)
      .build();
  }
}
