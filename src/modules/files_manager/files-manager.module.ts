import { Module } from '@nestjs/common';
import { GeneralJournalsFilesController } from './controllers';
import { GeneralJournalsFilesService } from './services';

@Module({
  providers: [GeneralJournalsFilesService],
  controllers: [GeneralJournalsFilesController],
  exports: [GeneralJournalsFilesService],
})
export class FilesManagerModule {}
