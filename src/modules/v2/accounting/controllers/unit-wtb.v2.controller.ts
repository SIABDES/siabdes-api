import {
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { WtbV2Service } from '../services';
import { GetWtbV2Dto } from '../dto';
import { GetUser } from '~modules/v1/auth/decorators';
import { JwtUserPayload } from '~modules/v1/auth/types';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller({
  path: 'units/:unit_id/wtb',
  version: '2',
})
@UseInterceptors(CacheInterceptor)
export class UnitWtbV2Controller {
  private readonly logger: Logger = new Logger(UnitWtbV2Controller.name);

  constructor(private readonly wtbService: WtbV2Service) {}

  @Get()
  async getWtb(
    @Query() dto: GetWtbV2Dto,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(
      `Get unit '${unitId}' WTB with query: ${JSON.stringify(dto)}`,
    );

    const result = await this.wtbService.getUnitWtb({
      ...dto,
      unit_id: unitId,
    });

    this.logger.log(
      `Get unit '${unitId}' WTB with query: ${JSON.stringify(dto)} - Done`,
    );

    return result;
  }

  @Get('summary')
  async getWtbSummary(
    @Query() dto: GetWtbV2Dto,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(
      `Get unit '${unitId}' WTB summary with query: ${JSON.stringify(dto)}`,
    );

    const result = await this.wtbService.getUnitWtbSummary({
      ...dto,
      unit_id: unitId,
    });

    this.logger.log(
      `Get unit '${unitId}' WTB summary with query: ${JSON.stringify(
        dto,
      )} - Done`,
    );

    return result;
  }
}
