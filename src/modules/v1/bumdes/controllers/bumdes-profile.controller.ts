import { Body, Controller, Get, Logger, Param, Put } from '@nestjs/common';
import { UpdateBumdesProfileDto } from '../dto';
import { BumdesProfileService } from '../services';

@Controller('bumdes/:bumdesId/profile')
export class BumdesProfileController {
  private logger: Logger = new Logger(BumdesProfileController.name);

  constructor(private readonly profileService: BumdesProfileService) {}

  @Get()
  async getProfile(@Param('bumdesId') bumdesId: string) {
    const result = await this.profileService.getProfile(bumdesId);

    this.logger.log(`Get profile for ${bumdesId}`);

    return result;
  }

  @Put()
  async updateProfile(
    @Param('bumdesId') bumdesId: string,
    @Body() dto: UpdateBumdesProfileDto,
  ) {
    const result = await this.profileService.updateProfile(bumdesId, dto);

    this.logger.log(`Update profile for ${bumdesId}`);

    return result;
  }
}
