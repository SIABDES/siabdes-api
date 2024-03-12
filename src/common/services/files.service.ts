import { BadRequestException, Injectable } from '@nestjs/common';
import { ItemBucketMetadata } from 'minio';
import { URL_GET_EXPIRY, URL_PUT_EXPIRY } from '~common/constants';
import { CommonFilePathDto } from '~common/dto';
import { generateResourceKey } from '~common/helpers';
import { FileResponseHeaders } from '~common/types';
import { MinioService } from '~lib/minio/minio.service';

@Injectable()
export class FilesService {
  constructor(private minio: MinioService) {}

  async upload(
    file: Express.Multer.File,
    path: CommonFilePathDto,
    metadata?: ItemBucketMetadata,
  ) {
    const key = path.key || generateResourceKey(file, path);

    await this.minio.putObject(
      this.minio.bucketName,
      key,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
        ...metadata,
      },
    );

    return { key };
  }

  async getUrl(
    key: string,
    options?: { expiry?: number; respHeaders?: FileResponseHeaders },
  ): Promise<string> {
    return await this.minio.presignedGetObject(
      this.minio.bucketName,
      key,
      options?.expiry || URL_GET_EXPIRY,
      options?.respHeaders ?? {},
    );
  }

  async delete(key: string): Promise<void> {
    await this.minio.removeObject(this.minio.bucketName, key);
  }

  async getUploadUrl(
    path: CommonFilePathDto,
    expiry?: number,
  ): Promise<string> {
    if (!path.key) throw new BadRequestException('Object key is required');

    return await this.minio.presignedPutObject(
      this.minio.bucketName,
      path.key,
      expiry || URL_PUT_EXPIRY,
    );
  }
}
