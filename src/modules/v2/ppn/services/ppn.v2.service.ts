import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AddPpnV2Dto } from '../dto';
import { PpnFileV2Service } from './ppn-file.v2.service';

@Injectable()
export class PpnV2Service {
  constructor(
    private prisma: PrismaService,
    private readonly fileService: PpnFileV2Service,
  ) {}

  async addPpn(evidence: MemoryStorageFile, dto: AddPpnV2Dto) {
    const path = await this.fileService.upload(evidence);
  }
}
