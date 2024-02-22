import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { CalkFilesService } from '../services';
import { GetUser } from '~modules/auth/decorators';
import { ResponseBuilder } from '~common/response.builder';

@Controller('files/calk')
export class CalkFilesController {
  private logger: Logger = new Logger(CalkFilesController.name);

  constructor(private readonly calkFilesService: CalkFilesService) {}

  @Get()
  async getListFilesKeys(@GetUser('unitId') unitId: string) {
    const result = await this.calkFilesService.getListFilesKeys(unitId, 'calk');

    this.logger.log('Get list files keys');

    return new ResponseBuilder()
      .setData(result)
      .setStatusCode(HttpStatus.OK)
      .setMessage('Berhasil mengambil list file')
      .build();
  }

  @Delete()
  async deleteFile(@Query('key') key: string) {
    await this.calkFilesService.deleteFile(key);

    this.logger.log(`Delete file with key ${key}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Berhasil menghapus file')
      .build();
  }
}
