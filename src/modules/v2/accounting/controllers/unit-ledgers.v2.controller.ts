import {
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { LedgersV2Service } from '../services';
import { GetUser, HasRoles } from '~modules/v1/auth/decorators';
import { AuthUserRole } from '@prisma/client';
import { GetAllLedgersV2Dto, GetLedgersV2Dto } from '../dto';
import { JwtUserPayload } from '~modules/v1/auth/types';

@Controller({
  path: 'units/:unit_id/ledgers',
  version: '2',
})
@HasRoles(AuthUserRole.UNIT)
export class UnitLedgersV2Controller {
  private readonly logger: Logger = new Logger(UnitLedgersV2Controller.name);

  constructor(private readonly ledgersService: LedgersV2Service) {}

  @Get()
  async get(
    @Query() dto: GetLedgersV2Dto,
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(`Get ledgers for unit ${unitId}`);

    const result = await this.ledgersService.getLedgers({
      ...dto,
      unit_id: unitId,
    });

    this.logger.log(`Get ledgers for unit ${unitId} success!`);

    return result;
  }

  @Get('/all')
  async getAllLedgers(
    @Query() dto: GetAllLedgersV2Dto,
    @GetUser() user: JwtUserPayload,
    @Param('unit_id') unitId: string,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(`Get all ledgers for unit ${unitId}`);

    const result = await this.ledgersService.getAllLedgers({
      ...dto,
      unit_id: unitId,
    });

    this.logger.log(`Get all ledgers for unit ${unitId} success!`);

    return result;
  }

  @Get('/final-balance')
  async getFinalBalance(
    @Query() dto: GetLedgersV2Dto,
    @GetUser() user: JwtUserPayload,
    @Param('unit_id') unitId: string,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(
      `Get final balance for unit '${unitId}' and account ID '${dto.account_id}'`,
    );

    const result = await this.ledgersService.getLedgerFinalBalance({
      ...dto,
      unit_id: unitId,
    });

    this.logger.log(
      `Get final balance success for unit '${unitId}' and account ID '${dto.account_id}'!`,
    );

    return result;
  }
}
