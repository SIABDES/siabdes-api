import { Module } from '@nestjs/common';
import { CalkFilesService, JournalFilesService } from './services';
import { CalkFilesController, JournalFilesController } from './controllers';

@Module({
  providers: [JournalFilesService, CalkFilesService],
  controllers: [JournalFilesController, CalkFilesController],
  exports: [JournalFilesService, CalkFilesService],
})
export class FilesManagerModule {}
