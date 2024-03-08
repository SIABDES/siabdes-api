import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      errorFormat: 'pretty',
      log: ['info', process.env.NODE_ENV === 'development' ? 'query' : 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
