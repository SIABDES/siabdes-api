import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as Minio from 'minio';
import { IMinioService } from './interfaces';

@Injectable()
export class MinioService implements IMinioService {
  private client: Minio.Client;

  constructor(private config: ConfigService) {
    this.client = new Minio.Client({
      secretKey: config.getOrThrow('MINIO_SECRET_KEY'),
      accessKey: config.getOrThrow('MINIO_ACCESS_KEY'),
      endPoint: config.getOrThrow('MINIO_ENDPOINT'),
      useSSL: config.get('MINIO_USE_SSL') ?? false,
    });
  }
}
