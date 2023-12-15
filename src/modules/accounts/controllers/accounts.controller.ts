import { Controller, Get, HttpStatus, Logger, Query } from '@nestjs/common';
import { AccountsService } from '../services';
import { AccountsFiltersDto } from '../dto';
import { PaginationDto } from '~common/dto';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser } from '~modules/auth/decorators';

@Controller('accounts')
export class AccountsController {
  private logger: Logger = new Logger('AccountsController');

  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(
    @GetUser('unitId') unitId?: string,
    @Query() filters?: AccountsFiltersDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.accountsService.findAll(
      filters,
      unitId,
      pagination,
    );

    this.logger.log(`Get accounts for unit id success`);
    this.logger.log(`Query Filter: ${JSON.stringify(filters)}`);
    this.logger.log(`Query Pagination: ${JSON.stringify(pagination)}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Akun berhasil diambil')
      .setData(result)
      .build();
  }

  @Get('subgroups')
  async findAllSubgroups() {
    const result = await this.accountsService.findAllSubgroups();

    this.logger.log(`Get accounts subgroups success`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Sub-kelompok akun berhasil diambil')
      .setData(result)
      .build();
  }
}
