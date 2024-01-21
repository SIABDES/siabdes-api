import { Injectable } from '@nestjs/common';
import { MinioService } from '~lib/minio/minio.service';
import { generateFileName, generatePpnKeyPath } from '../helpers';
import { IPpnFilesService } from '../interfaces';
import { PPN_TRANSACTION_EVIDENCE_EXPIRY } from '../constants';

@Injectable()
export class PpnFilesService implements IPpnFilesService {
  constructor(private minio: MinioService) {}

  async deletePpnEvidence(evidenceKey: string): Promise<void> {
    return await this.minio.client.removeObject(
      this.minio.bucketName,
      evidenceKey,
    );
  }

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
        {
          'Content-Type': evidence.mimetype,
          'Content-Length': evidence.size,
          // 'Content-Disposition': 'inline',
        },
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
        PPN_TRANSACTION_EVIDENCE_EXPIRY,
        {
          'response-content-disposition': 'inline',
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
