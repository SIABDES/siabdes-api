import { Injectable } from '@nestjs/common';
import { MinioService } from '~lib/minio/minio.service';
import { generateFileName, generatePpnKeyPath } from '../helpers';
import { IPpnFilesService } from '../interfaces';

@Injectable()
export class PpnFilesService implements IPpnFilesService {
  constructor(private minio: MinioService) {}

  async uploadPpnEvidence(
    unitId: string,
    bumdesId: string,
    evidence: Express.Multer.File,
  ): Promise<string> {
    const fileName = generateFileName(evidence);
    const key = generatePpnKeyPath(fileName, unitId, bumdesId);

    try {
      await this.minio.client.putObject(
        this.minio.bucketName,
        key,
        evidence.buffer,
      );
      return key;
    } catch (error) {
      throw error;
    }
  }

  async getPpnEvidenceUrl(evidenceKey: string): Promise<string> {
    try {
      return await this.minio.client.presignedGetObject(
        this.minio.bucketName,
        evidenceKey,
      );
    } catch (error) {
      throw error;
    }
  }
}
