import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { MinioService } from '~lib/minio/minio.service';

@Injectable()
export class PpnFileV2Service {
  constructor(private minio: MinioService) {}

  async upload(file: MemoryStorageFile) {}

  async getUrl(key: string) {}

  async delete(key: string) {}
}
