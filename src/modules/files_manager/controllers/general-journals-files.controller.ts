import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GeneralJournalsFilesService } from '../services';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '~modules/auth/decorators';
import { JwtUserPayload } from '~modules/auth/types';
import { ResponseBuilder } from '~common/response.builder';

@Controller('files/general_journals')
export class GeneralJournalsFilesController {
  constructor(private readonly service: GeneralJournalsFilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('evidence'))
  async uploadEvidence(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: JwtUserPayload,
  ) {
    const result = await this.service.uploadEvidence(
      file,
      user.bumdesId,
      user.unitId,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.CREATED)
      .setData(result)
      .build();
  }

  @Get(':journalId')
  async getEvidenceUrl(@Param('journalId') journalId: string) {
    const result = await this.service.getEvidenceUrl(journalId);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setData(result)
      .build();
  }
}
