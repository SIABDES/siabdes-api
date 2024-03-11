import { Body, Controller, Get, Logger, Param, Put } from '@nestjs/common';
import { UpdateBumdesOrganizationDto } from '../dto';
import { BumdesOrganizationService } from '../services';

@Controller('bumdes/:bumdesId/organization')
export class BumdesOrganizationController {
  private logger: Logger = new Logger(BumdesOrganizationController.name);

  constructor(private organizationService: BumdesOrganizationService) {}

  @Get()
  async getOrganization(@Param('bumdesId') bumdesId: string) {
    const result = await this.organizationService.getOrganization(bumdesId);

    this.logger.log(`Get organization for ${bumdesId}`);

    return result;
  }

  @Put()
  async updateOrganization(
    @Param('bumdesId') bumdesId: string,
    @Body() dto: UpdateBumdesOrganizationDto,
  ) {
    const result = await this.organizationService.updateOrganization(
      bumdesId,
      dto,
    );

    this.logger.log(`Update organization for ${bumdesId}`);

    return result;
  }
}
