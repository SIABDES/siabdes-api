import { Controller, Delete, Get, Logger, Query } from '@nestjs/common';
import { GetUser } from '~modules/v1/auth/decorators';
import { CalkFilesService } from '../services';

@Controller('files/calk')
export class CalkFilesController {
  private logger: Logger = new Logger(CalkFilesController.name);

  constructor(private readonly calkFilesService: CalkFilesService) {}

  @Get()
  async getListFilesKeys(@GetUser('unitId') unitId: string) {
    const result = await this.calkFilesService.getListFilesKeys(unitId, 'calk');

    this.logger.log('Get list files keys');

    return result;
  }

  @Delete()
  async deleteFile(@Query('key') key: string) {
    await this.calkFilesService.deleteFile(key);

    this.logger.log(`Delete file with key ${key}`);
  }
}
