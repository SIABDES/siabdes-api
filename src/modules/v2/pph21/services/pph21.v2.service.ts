import { Injectable } from '@nestjs/common';
import { PrismaService } from '~lib/prisma/prisma.service';

@Injectable()
export class Pph21V2Service {
  constructor(private prisma: PrismaService) {}

  async add(dto: any) {}

  async updateById(id: string, dto: any) {}

  async getById(id: string) {}

  async getMany() {}

  async softDeleteById(id: string) {}

  async hardDeleteById(id: string) {}
}
