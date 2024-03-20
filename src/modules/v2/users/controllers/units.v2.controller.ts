import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { UnitV2Service } from '../services';
import { HasRoles } from '~modules/v1/auth/decorators';
import { AuthUserRole } from '@prisma/client';
import { GetManyUnitsV2Dto } from '../dto';

@Controller({
  path: 'units',
  version: '2',
})
@HasRoles(AuthUserRole.SUPER_ADMIN)
export class UnitsV2Controller {
  private readonly logger: Logger = new Logger(UnitsV2Controller.name);

  constructor(private readonly unitService: UnitV2Service) {}

  @Get()
  async getMany(@Query() dto: GetManyUnitsV2Dto) {
    this.logger.log('Get many units');

    return this.unitService.findMany(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    this.logger.log('Get unit by ID');

    return this.unitService.findById(id);
  }
}
