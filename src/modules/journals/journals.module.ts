import { Module } from '@nestjs/common';
import { JournalsController } from './controllers';
import { JournalsService } from './services';
import { FilesManagerModule } from '~modules/files_manager/files-manager.module';

@Module({
  controllers: [JournalsController],
  providers: [JournalsService],
  exports: [JournalsService],
  imports: [FilesManagerModule],
})
export class JournalsModule {}
