import { Body, Controller, Get, Logger, Param, Put } from '@nestjs/common';
import { UpdateUnitProfileDto } from '../dto';
import { UnitProfileService } from '../services';

@Controller('units/:unitId/profile')
export class UnitProfileController {
  private logger: Logger = new Logger(UnitProfileController.name);

  constructor(private readonly profileService: UnitProfileService) {}

  @Get()
  async getUnitProfile(@Param('unitId') unitId: string) {
    const result = await this.profileService.getUnitProfile(unitId);

    this.logger.log(`Get unit profile with unitId: '${unitId}'`);

    return result;
  }

  @Put()
  async updateUnitProfile(
    @Param('unitId') unitId: string,
    @Body() dto: UpdateUnitProfileDto,
  ) {
    const result = await this.profileService.updateUnitProfile(unitId, dto);

    this.logger.log(`Updated unit profile with unitId: '${unitId}'`);

    return result;
  }
}
