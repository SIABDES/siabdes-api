import { Controller, Get, HttpStatus, Logger, Query } from '@nestjs/common';
import { AccountsService } from '../services';
import { AccountsFiltersDto } from '../dto';
import { PaginationDto } from '~common/dto';
import { ResponseBuilder } from '~common/response.builder';

@Controller('accounts')
export class AccountsController {
  private logger: Logger = new Logger('AccountsController');

  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(
    @Query() filters?: AccountsFiltersDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.accountsService.findAll(filters, pagination);

    this.logger.log(`Get accounts`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Akun berhasil diambil')
      .setData(result)
      .build();
  }
}
