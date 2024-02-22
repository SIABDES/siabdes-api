import { Injectable, NotFoundException } from '@nestjs/common';
import { MinioService } from '~lib/minio/minio.service';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  generateBaseLocationForFinancialStatement,
  generateFileName,
  generateFinancialStatementKeyPath,
} from '../helpers';
import { ICalkFilesService } from '../interfaces';
import {
  CalkFileInputType,
  FinancialStatementFileList,
  FinancialStatementType,
} from '../types';

@Injectable()
export class CalkFilesService implements ICalkFilesService {
  constructor(
    private prisma: PrismaService,
    private minio: MinioService,
  ) {}

  async upload({
    file,
    unitId,
    bumdesId,
    type,
  }: CalkFileInputType): Promise<string> {
    let bumdes_id: string = bumdesId;

    if (!bumdesId) {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
      });

      if (!unit) throw new NotFoundException('Unit not found');

      bumdes_id = unit.bumdesId;
    }

    const key = generateFinancialStatementKeyPath(
      generateFileName(file),
      bumdes_id,
      unitId,
      type,
    );

    return new Promise(async (resolve, reject) => {
      try {
        await this.minio.client.putObject(
          this.minio.bucketName,
          key,
          file.buffer,
        );

        resolve(key);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getListFilesKeys(
    unitId: string,
    type: FinancialStatementType,
  ): Promise<FinancialStatementFileList> {
    const unit = await this.prisma.bumdesUnit.findUnique({
      where: { id: unitId },
    });

    if (!unit) throw new NotFoundException('Unit not found');

    const basePath = generateBaseLocationForFinancialStatement(
      unitId,
      unit.bumdesId,
      type,
    );

    const delimiter = '/';

    return new Promise((resolve, reject) => {
      const stream = this.minio.client.listObjectsV2(
        this.minio.bucketName,
        basePath,
        true,
        delimiter,
      );

      const objectUrls: FinancialStatementFileList = {};

      stream.on('data', async (obj) => {
        const { name } = obj;
        const nameWithoutBasePath = name.replace(basePath, '');

        try {
          const url = await this.minio.client.presignedGetObject(
            this.minio.bucketName,
            name,
          );

          objectUrls[nameWithoutBasePath] = {
            key: name,
            url,
          };
        } catch (error) {
          reject(error);
        }
      });

      stream.on('end', () => {
        resolve(objectUrls);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async deleteFile(key: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.minio.client.removeObject(this.minio.bucketName, key);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
