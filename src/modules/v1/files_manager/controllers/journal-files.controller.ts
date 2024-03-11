import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JournalFilesService } from '../services';
import { JournalFileInputType } from '../types';

@Controller('files/journals')
export class JournalFilesController {
  private logger: Logger = new Logger(JournalFilesController.name);

  constructor(private readonly journalFilesService: JournalFilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: JournalFileInputType,
  ) {
    const key = await this.journalFilesService.upload({
      file,
      ...body,
    });

    this.logger.log(`Uploaded file ${file.originalname} as ${key}`);

    return key;
  }

  @Get(':journalId/evidence')
  async getUrlEvidence(@Param('journalId') journalId: string) {
    const result = await this.journalFilesService.getUrl(journalId);

    this.logger.log(`Get url of evidence file ${journalId}`);

    return result;
  }
}
