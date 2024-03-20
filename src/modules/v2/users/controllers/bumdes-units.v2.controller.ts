import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UnitV2Service } from '../services';
import { GetUser, HasRoles } from '~modules/v1/auth/decorators';
import { JwtUserPayload } from '~modules/v1/auth/types';
import { AddUnitV2Dto, GetManyUnitsV2Dto } from '../dto';
import { CommonDeleteDto } from '~common/dto';
import { AuthUserRole } from '@prisma/client';

@Controller({
  path: 'bumdes/:bumdes_id/units',
  version: '2',
})
@HasRoles(AuthUserRole.BUMDES)
export class BumdesUnitsV2Controller {
  private readonly logger: Logger = new Logger(BumdesUnitsV2Controller.name);

  constructor(private readonly unitService: UnitV2Service) {}

  @Post()
  async createNewUnit(
    @Param('bumdes_id') bumdesId: string,
    @GetUser() user: JwtUserPayload,
    @Body() dto: AddUnitV2Dto,
  ) {
    if (bumdesId !== user.bumdesId) throw new ForbiddenException();

    this.logger.log('Create new unit');

    return this.unitService.create({ ...dto, bumdes_id: bumdesId });
  }

  @Delete(':id')
  async deleteUnit(
    @Param('bumdes_id') bumdesId: string,
    @Param('id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Query() dto: CommonDeleteDto,
  ) {
    if (bumdesId !== user.bumdesId) throw new ForbiddenException();

    this.logger.log('Delete unit');

    let result;

    if (dto.hard_delete) {
      result = await this.unitService.hardDeleteById(unitId, dto);
    } else {
      result = await this.unitService.softDeleteById(unitId);
    }

    return result;
  }

  @Get()
  async getManyUnits(
    @Param('bumdes_id') bumdesId: string,
    @GetUser() user: JwtUserPayload,
    @Query() dto: GetManyUnitsV2Dto,
  ) {
    if (bumdesId !== user.bumdesId) throw new ForbiddenException();

    this.logger.log('Getting many units');

    return this.unitService.findMany({ ...dto, bumdes_id: bumdesId });
  }

  @Get(':id')
  async getUnitById(
    @Param('bumdes_id') bumdesId: string,
    @Param('id') unitId: string,
    @GetUser() user: JwtUserPayload,
  ) {
    if (bumdesId !== user.bumdesId) throw new ForbiddenException();

    this.logger.log('Getting unit by ID');

    return this.unitService.findById(unitId);
  }
}
