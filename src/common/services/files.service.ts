import { Injectable } from '@nestjs/common';
import { MinioService } from '~lib/minio/minio.service';

@Injectable()
export class FilesService {
  constructor(private minio: MinioService) {}
}
