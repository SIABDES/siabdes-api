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
import { AuthUserRole } from '@prisma/client';
import { OptionalCommonDeleteDto } from '~common/dto';
import { GetUser, HasRoles, Public } from '~modules/v1/auth/decorators';
import { JwtUserPayload } from '~modules/v1/auth/types';
import { AddBumdesV2Dto, GetManyBumdesV2Dto } from '../dto';
import { BumdesV2Service } from '../services';

@Controller({
  path: 'bumdes',
  version: '2',
})
export class BumdesV2Controller {
  private readonly logger: Logger = new Logger(BumdesV2Controller.name);

  constructor(private readonly bumdesService: BumdesV2Service) {}

  @Post()
  @Public()
  async createNewBumdes(@Body() dto: AddBumdesV2Dto) {
    const result = await this.bumdesService.create(dto);

    return result;
  }

  @Get()
  @HasRoles(AuthUserRole.SUPER_ADMIN)
  async getManyBumdes(@Query() dto: GetManyBumdesV2Dto) {
    const result = await this.bumdesService.findMany(dto);

    return result;
  }

  @Get(':id')
  @HasRoles(AuthUserRole.SUPER_ADMIN, AuthUserRole.BUMDES)
  async getBumdesById(
    @Param('id') bumdesId: string,
    @GetUser() user: JwtUserPayload,
  ) {
    if (user.role === AuthUserRole.BUMDES && bumdesId !== user.bumdesId)
      throw new ForbiddenException();

    const result = await this.bumdesService.findById(bumdesId);

    return result;
  }

  @Delete(':id')
  @HasRoles(AuthUserRole.SUPER_ADMIN, AuthUserRole.BUMDES)
  async deleteBumdes(
    @Param('id') bumdesId: string,
    @GetUser() user: JwtUserPayload,
    @Query() dto?: OptionalCommonDeleteDto,
  ) {
    if (user.role === AuthUserRole.BUMDES && bumdesId !== user.bumdesId)
      throw new ForbiddenException();

    this.logger.log(`Delete Bumdes with id: ${bumdesId}`);

    let result;

    if (dto?.hard_delete) {
      result = await this.bumdesService.hardDeleteById(bumdesId, dto);
    } else {
      result = await this.bumdesService.softDeleteById(bumdesId);
    }

    this.logger.log(
      `Bumdes with id: ${bumdesId} has been deleted. Hard delete: ${dto?.hard_delete ?? false}`,
    );

    return result;
  }
}
