import { Global, Module } from '@nestjs/common';
import { FilesService } from './services';

@Global()
@Module({
  providers: [FilesService],
  exports: [FilesService],
})
export class CommonModule {}
