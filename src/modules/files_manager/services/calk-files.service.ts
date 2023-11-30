import { Injectable } from '@nestjs/common';
import { ICalkFilesService } from '../interfaces';
import { MinioService } from '~lib/minio/minio.service';
import {
  generateBaseLocationForFinancialStatement,
  generateFinancialStatementKeyPath,
} from '../helpers';

@Injectable()
export class CalkFilesService implements ICalkFilesService {
  constructor(private minio: MinioService) {}

  async uploadCALKFile(
    file: Express.Multer.File,
    unitId: string,
    bumdesId: string,
  ): Promise<string> {
    const keyPath = generateFinancialStatementKeyPath(
      file,
      bumdesId,
      unitId,
      'calk',
    );

    await this.minio.client.putObject(
      this.minio.bucketName,
      keyPath,
      file.buffer,
    );

    return keyPath;
  }

  async getListCALKFilesURLs(
    unitId: string,
    bumdesId: string,
  ): Promise<string[]> {
    const baseKey = generateBaseLocationForFinancialStatement(
      unitId,
      bumdesId,
      'calk',
    );

    const items = await this.minio.client.listObjectsV2(
      this.minio.bucketName,
      baseKey,
      true,
    );

    items.map((item) => {
      console.log(item);
    });

    return [];
  }

  deleteCALKFile(fileKey: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
