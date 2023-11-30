import {
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CalkFilesService } from '../services';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '~modules/auth/decorators';

@Controller('files/calk')
export class CalkFilesController {
  private logger: Logger = new Logger(CalkFilesController.name);

  constructor(private readonly calkFilesService: CalkFilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadCalkFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('bumdesId') bumdesId: string,
    @GetUser('unitId') unitId: string,
  ) {
    return await this.calkFilesService.uploadCALKFile(file, unitId, bumdesId);
  }

  @Get()
  async getCalkFilesForUnit(
    @GetUser('unitId') unitId: string,
    @GetUser('bumdesId') bumdesId: string,
  ) {
    await this.calkFilesService.getListCALKFilesURLs(unitId, bumdesId);
  }

  @Delete()
  async deleteCalkFile() {}
}
