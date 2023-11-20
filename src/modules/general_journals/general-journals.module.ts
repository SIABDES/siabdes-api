import { Module } from '@nestjs/common';
import { FilesManagerModule } from '~modules/files_manager/files-manager.module';
import { GeneralJournalsController } from './controllers';
import { GeneralJournalsService } from './services';

@Module({
  imports: [FilesManagerModule],
  providers: [GeneralJournalsService],
  exports: [GeneralJournalsService],
  controllers: [GeneralJournalsController],
})
export class GeneralJournalsModule {}
