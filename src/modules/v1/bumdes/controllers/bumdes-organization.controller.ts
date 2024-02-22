import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Put,
} from '@nestjs/common';
import { ResponseBuilder } from '~common/response.builder';
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

    return new ResponseBuilder()
      .setMessage('Berhasil mendapatkan data organisasi BUMDes')
      .setStatusCode(HttpStatus.OK)
      .setData(result)
      .build();
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

    return new ResponseBuilder()
      .setMessage('Berhasil mengubah data organisasi BUMDes')
      .setStatusCode(HttpStatus.OK)
      .setData(result)
      .build();
  }
}
