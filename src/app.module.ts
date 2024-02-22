import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { EnvSchema } from '~common/types';
import { MinioModule } from '~lib/minio/minio.module';
import { V1Module } from '~modules/v1/v1.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { V2Module } from '~modules/v2/v2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate(config) {
        const result = EnvSchema.safeParse(config);

        if (!result.success) {
          return;
        }

        return result.data;
      },
    }),
    PrismaModule,
    MinioModule,
    V1Module,
    V2Module,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
