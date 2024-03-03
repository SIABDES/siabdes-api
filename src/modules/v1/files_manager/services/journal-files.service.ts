import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MinioService } from '~lib/minio/minio.service';
import { PrismaService } from '~lib/prisma/prisma.service';
import { JOURNAL_EVIDENCE_EXPIRY } from '../constants';
import { generateFileName, generateJournalsKeyPath } from '../helpers';
import { IJournalFilesService } from '../interfaces';
import { JournalFileInputType } from '../types';

@Injectable()
export class JournalFilesService implements IJournalFilesService {
  constructor(
    private prisma: PrismaService,
    private minio: MinioService,
  ) {}

  async upload({
    file,
    unitId,
    category,
    bumdesId,
  }: JournalFileInputType): Promise<string | null> {
    if (!file) return null;

    let foundBumdesId = bumdesId;

    if (!foundBumdesId) {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
      });

      if (!unit) throw new BadRequestException('Unit tidak ditemukan');

      foundBumdesId = unit.bumdesId;
    }

    const name = generateFileName(file);

    const key = generateJournalsKeyPath(
      name,
      foundBumdesId,
      unitId,
      category === 'ADJUSTMENT',
    );

    await this.minio.putObject(this.minio.bucketName, key, file.buffer);

    return key;
  }

  async getUrl(journalId: string): Promise<string> {
    const journal = await this.prisma.journal.findUnique({
      where: { id: journalId },
    });

    if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

    const { evidence } = journal;

    if (!evidence) throw new NotFoundException('Bukti jurnal tidak ditemukan');

    const url = await this.minio.presignedGetObject(
      this.minio.bucketName,
      evidence,
      JOURNAL_EVIDENCE_EXPIRY,
      {
        'response-content-disposition': 'inline',
      },
    );

    return url;
  }
}
