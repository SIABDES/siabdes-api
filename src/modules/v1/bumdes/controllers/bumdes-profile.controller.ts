import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Put,
} from '@nestjs/common';
import { BumdesProfileService } from '../services';
import { ResponseBuilder } from '~common/response.builder';
import { UpdateBumdesProfileDto } from '../dto';

@Controller('bumdes/:bumdesId/profile')
export class BumdesProfileController {
  private logger: Logger = new Logger(BumdesProfileController.name);

  constructor(private readonly profileService: BumdesProfileService) {}

  @Get()
  async getProfile(@Param('bumdesId') bumdesId: string) {
    const result = await this.profileService.getProfile(bumdesId);

    this.logger.log(`Get profile for ${bumdesId}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Berhasil mendapatkan data profil BUMDes')
      .setData(result)
      .build();
  }

  @Put()
  async updateProfile(
    @Param('bumdesId') bumdesId: string,
    @Body() dto: UpdateBumdesProfileDto,
  ) {
    const result = await this.profileService.updateProfile(bumdesId, dto);

    this.logger.log(`Update profile for ${bumdesId}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Berhasil mengubah data profil BUMDes')
      .setData(result)
      .build();
  }
}
