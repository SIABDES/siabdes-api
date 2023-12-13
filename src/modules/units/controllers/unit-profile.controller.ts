import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Put,
} from '@nestjs/common';
import { UnitProfileService } from '../services/unit-profile.service';
import { ResponseBuilder } from '~common/response.builder';
import { UpdateUnitProfileDto } from '../dto';

@Controller('units/:unitId/profile')
export class UnitProfileController {
  private logger: Logger = new Logger(UnitProfileController.name);

  constructor(private readonly profileService: UnitProfileService) {}

  @Get()
  async getUnitProfile(@Param('unitId') unitId: string) {
    const result = await this.profileService.getUnitProfile(unitId);

    this.logger.log(`Get unit profile with unitId: '${unitId}'`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Successfully get unit profile')
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Put()
  async updateUnitProfile(
    @Param('unitId') unitId: string,
    @Body() dto: UpdateUnitProfileDto,
  ) {
    const result = await this.profileService.updateUnitProfile(unitId, dto);

    this.logger.log(`Updated unit profile with unitId: '${unitId}'`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Successfully updated unit profile')
      .setStatusCode(HttpStatus.OK)
      .build();
  }
}
