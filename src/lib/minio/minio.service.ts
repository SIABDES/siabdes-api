import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Env } from '~common/types';

@Injectable()
export class MinioService extends Client implements OnModuleInit {
  private logger = new Logger(MinioService.name);
  private configBucketName: string;

  constructor(config: ConfigService<Env>) {
    super({
      accessKey: config.get('MINIO_ACCESS_KEY'),
      secretKey: config.get('MINIO_SECRET_KEY'),
      endPoint: config.get('MINIO_ENDPOINT'),
      port: parseInt(config.get('MINIO_PORT')) || undefined,
      useSSL: config.get('MINIO_USE_SSL') === 'true' ? true : false,
    });

    this.configBucketName = config.get('MINIO_BUCKET_NAME');
  }

  get bucketName() {
    return this.configBucketName;
  }

  async checkBucketExists() {
    this.logger.log(`Checking default bucket '${this.bucketName}' exists`);

    this.bucketExists(this.bucketName, async (err, exists) => {
      if (err) {
        this.logger.error('Failed to check bucket exists');
        this.logger.error(err.message);
        throw err;
      }

      this.logger.log('Successfully connected to MinIO Service');

      if (!exists) {
        try {
          await this.makeBucket(this.bucketName);
          this.logger.log(`Bucket '${this.bucketName}' created`);
        } catch (error) {
          this.logger.error(`Failed to create bucket '${this.bucketName}'`);
          this.logger.error(error);
          throw error;
        }
      }

      this.logger.log(`Bucket '${this.bucketName}' check completed`);

      return exists;
    });
  }

  async onModuleInit() {
    await this.checkBucketExists();
  }
}
