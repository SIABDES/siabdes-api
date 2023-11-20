import { Injectable, OnModuleInit } from '@nestjs/common';
import { MinioService } from '~lib/minio/minio.service';
import { IGeneralJournalsFilesService } from '../interfaces';
import { PrismaService } from '~lib/prisma/prisma.service';

@Injectable()
export class GeneralJournalsFilesService
  implements IGeneralJournalsFilesService
{
  constructor(
    private minio: MinioService,
    private prisma: PrismaService,
  ) {}

  async uploadEvidence(
    file: Express.Multer.File,
    bumdesId: string,
    unitId: string,
  ): Promise<string> {
    const key = `${bumdesId}/${unitId}/general_journals/${file.originalname}`;

    await this.minio.client.putObject(this.minio.bucketName, key, file.buffer);

    // console.log({ minio: this.minio.client });

    return key;
  }

  async getEvidenceUrl(journalId: string): Promise<string> {
    const journal = await this.prisma.generalJournal.findUnique({
      where: { id: journalId },
      select: { evidence: true },
    });

    return this.minio.client.presignedUrl(
      'GET',
      this.minio.bucketName,
      journal.evidence,
    );
  }
}
