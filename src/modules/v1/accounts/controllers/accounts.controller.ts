import { Controller, Get, Logger, Query } from '@nestjs/common';
import { OptionalPaginationDto } from '~common/dto';
import { GetUser } from '~modules/v1/auth/decorators';
import { AccountsFiltersDto } from '../dto';
import { AccountsService } from '../services';

@Controller('accounts')
export class AccountsController {
  private logger: Logger = new Logger('AccountsController');

  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(
    @GetUser('unitId') unitId?: string,
    @Query() filters?: AccountsFiltersDto,
    @Query() pagination?: OptionalPaginationDto,
  ) {
    const result = await this.accountsService.findAll(
      filters,
      unitId,
      pagination,
    );

    this.logger.log(`Get accounts for unit id success`);
    this.logger.log(`Query Filter: ${JSON.stringify(filters)}`);
    this.logger.log(`Query Pagination: ${JSON.stringify(pagination)}`);

    return result;
  }

  @Get('subgroups')
  async findAllSubgroups() {
    const result = await this.accountsService.findAllSubgroups();

    this.logger.log(`Get accounts subgroups success`);

    return result;
  }
}
