import { Module } from '@nestjs/common';
import {
  CalkFilesController,
  GeneralJournalsFilesController,
} from './controllers';
import { CalkFilesService, GeneralJournalsFilesService } from './services';

@Module({
  providers: [GeneralJournalsFilesService, CalkFilesService],
  controllers: [GeneralJournalsFilesController, CalkFilesController],
  exports: [GeneralJournalsFilesService, CalkFilesService],
})
export class FilesManagerModule {}
