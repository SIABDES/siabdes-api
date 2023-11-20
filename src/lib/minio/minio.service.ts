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
    const client = new Client({
      secretKey: config.getOrThrow('MINIO_SECRET_KEY'),
      accessKey: config.getOrThrow('MINIO_ACCESS_KEY'),
      endPoint: config.getOrThrow('MINIO_ENDPOINT'),
      useSSL: config.get('MINIO_USE_SSL') === 'true' ?? false,
      port: Number(config.get<string>('MINIO_PORT')),
    });

    return client;
  }

  async onModuleInit() {
    const isExists = await this.minioClient.bucketExists(this.bucket);

    if (isExists) return;

    try {
      await this.minioClient.makeBucket(this.bucket);
      this.logger.log(`Bucket ${this.bucket} created`);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  get client(): Client {
    return this.minioClient;
  }

  get bucketName(): string {
    return this.bucket;
  }
}
