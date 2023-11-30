import { Module } from '@nestjs/common';
import { JournalFilesService } from './services';
import { JournalFilesController } from './controllers';

@Module({
  providers: [JournalFilesService],
  controllers: [JournalFilesController],
  exports: [JournalFilesService],
})
export class FilesManagerModule {}
