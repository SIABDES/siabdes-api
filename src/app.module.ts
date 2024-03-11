import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  HTTP_EXCEPTION_FILTER_KEY,
  NestProblemDetailsModule,
} from 'nest-problem-details-filter';
import { ZodValidationPipe } from 'nestjs-zod';
import { CommonModule } from '~common/common.module';
import { ResponseInterceptor } from '~common/interceptors';
import { EnvSchema } from '~common/types';
import { MinioModule } from '~lib/minio/minio.module';
import { V1Module } from '~v1/v1.module';
import { V2Module } from '~v2/v2.module';
import { PrismaModule } from './lib/prisma/prisma.module';

@Module({
  imports: [
    NestProblemDetailsModule,
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
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000, // 60 seconds
          limit: 150,
        },
      ],
    }),
    CommonModule,
    PrismaModule,
    MinioModule,
    V1Module,
    V2Module,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useExisting: HTTP_EXCEPTION_FILTER_KEY,
    },
  ],
})
export class AppModule {}
