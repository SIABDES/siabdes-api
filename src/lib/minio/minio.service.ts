import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMinioService } from './interfaces';
import { Client } from 'minio';
import { Env } from '~common/types';

@Injectable()
export class MinioService implements IMinioService, OnModuleInit {
  private minioClient: Client;
  private bucket: string;
  private logger: Logger = new Logger(MinioService.name);

  constructor(private config: ConfigService<Env>) {
    this.bucket = config.get<string>('MINIO_BUCKET_NAME') || 'siabdes';
  }

  connect(): Client {
    const useSSL = this.config.get<boolean>('MINIO_USE_SSL');
    const secretKey = this.config.get('MINIO_SECRET_KEY');
    const accessKey = this.config.get('MINIO_ACCESS_KEY');
    const endPoint = this.config.get('MINIO_ENDPOINT');
    const port = this.config.get('MINIO_PORT');

    const client = new Client({
      secretKey,
      accessKey,
      endPoint,
      useSSL,
      port: port ? parseInt(port) : undefined,
    });

    return client;
  }

  async checkBucketExists() {
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

      this.logger.log('Bucket check completed');

      return exists;
    });
  }

  async onModuleInit() {
    this.minioClient = this.connect();

    await this.checkBucketExists();
  }

  get client(): Client {
    return this.minioClient;
  }

  get bucketName(): string {
    return this.bucket;
  }
}
