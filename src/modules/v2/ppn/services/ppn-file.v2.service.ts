import { Injectable } from '@nestjs/common';
import { CommonFilePathDto } from '~common/dto';
import { generateResourcePath } from '~common/helpers/file-path.helper';
import { MinioService } from '~lib/minio/minio.service';
import { PpnFileUploadV2Response } from '../responses';

@Injectable()
export class PpnFileV2Service {
  constructor(private minio: MinioService) {}

  async upload(
    file: Express.Multer.File,
    path: CommonFilePathDto,
  ): Promise<PpnFileUploadV2Response> {
    const key = generateResourcePath({
      path,
      resource: 'ppn',
      file,
    });

    await this.minio.putObject(
      this.minio.bucketName,
      key,
      file.buffer,
      file.size,
    );

    return { key };
  }

  async getUrl(key: string): Promise<string> {
    return this.minio.presignedUrl('GET', this.minio.bucketName, key, 60 * 60);
  }

  async delete(key: string): Promise<void> {
    await this.minio.removeObject(this.minio.bucketName, key);
  }
}
