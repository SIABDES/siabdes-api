import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMinioService } from './interfaces';
import { Client } from 'minio';

@Injectable()
export class MinioService implements IMinioService, OnModuleInit {
  private minioClient: Client;
  private bucket: string;
  private logger: Logger = new Logger(MinioService.name);

  constructor(config: ConfigService) {
    this.bucket = config.get<string>('MINIO_BUCKET_NAME') || 'siabdes';

    this.minioClient = this.connect(config);
  }

  connect(config: ConfigService): Client {
    const isUseSSL = config.get('MINIO_USE_SSL') === 'true';
    const port = config.get<string>('MINIO_PORT');

    const client = new Client({
      secretKey: config.getOrThrow('MINIO_SECRET_KEY'),
      accessKey: config.getOrThrow('MINIO_ACCESS_KEY'),
      endPoint: config.getOrThrow('MINIO_ENDPOINT'),
      useSSL: isUseSSL,
      port: port ? parseInt(port) : undefined,
    });

    return client;
  }

  async onModuleInit() {
    this.minioClient.bucketExists(this.bucket, async (err, exists) => {
      if (err) {
        this.logger.error(err.message);
        throw err;
      }

      this.logger.log('Successfully connected to MinIO Service');

      if (!exists) {
        try {
          await this.minioClient.makeBucket(this.bucket);
          this.logger.log(`Bucket ${this.bucket} created`);
        } catch (error) {
          this.logger.error(error);
          throw error;
        }
      }

      return exists;
    });
  }

  get client(): Client {
    return this.minioClient;
  }

  get bucketName(): string {
    return this.bucket;
  }
}
