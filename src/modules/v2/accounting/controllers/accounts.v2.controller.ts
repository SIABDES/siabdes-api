import {
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Query,
} from '@nestjs/common';
import { AccountsV2Service } from '../services';
import { GetAccountsV2Dto, GetSubGroupAccountsV2Dto } from '../dto';
import { GetUser } from '~modules/v1/auth/decorators';
import { JwtUserPayload } from '~modules/v1/auth/types';
import { AuthUserRole } from '@prisma/client';

@Controller({
  path: 'accounts',
  version: '2',
})
export class AccountsV2Controller {
  private readonly logger: Logger = new Logger(AccountsV2Controller.name);

  constructor(private readonly accountsService: AccountsV2Service) {}

  @Get()
  async getAccounts(
    @Query() dto: GetAccountsV2Dto,
    @GetUser() user: JwtUserPayload,
  ) {
    if (user.role === AuthUserRole.UNIT && dto.unit_id !== user.unitId)
      throw new ForbiddenException();

    if (user.role === AuthUserRole.UNIT) {
      dto.unit_id = user.unitId;
    }

    this.logger.log(`Get accounts with query: ${JSON.stringify(dto)}`);

    const result = await this.accountsService.getAccounts(dto);

    this.logger.log(`Get accounts success with query: ${JSON.stringify(dto)}`);

    return result;
  }

  @Get('subgroups')
  async getSubGroupAccounts(@Query() dto?: GetSubGroupAccountsV2Dto) {
    this.logger.log(`Get subgroups with query: ${JSON.stringify(dto)}`);

    const result = await this.accountsService.getSubGroupAccounts(dto);

    this.logger.log(`Get subgroups success with query: ${JSON.stringify(dto)}`);

    return result;
  }
}
