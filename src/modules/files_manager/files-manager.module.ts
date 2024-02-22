import { Module } from '@nestjs/common';
import {
  CalkFilesService,
  JournalFilesService,
  PpnFilesService,
} from './services';
import { CalkFilesController, JournalFilesController } from './controllers';

@Module({
  providers: [JournalFilesService, CalkFilesService, PpnFilesService],
  controllers: [JournalFilesController, CalkFilesController],
  exports: [JournalFilesService, CalkFilesService, PpnFilesService],
})
export class FilesManagerModule {}
