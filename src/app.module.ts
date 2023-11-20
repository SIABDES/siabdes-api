import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { MinioModule } from '~lib/minio/minio.module';
import { AdjustmentJournalsModule } from '~modules/adjustment_journals/adjustment-journals.module';
import { AuthModule } from '~modules/auth/auth.module';
import { AuthJwtGuard } from '~modules/auth/guards';
import { FilesManagerModule } from '~modules/files_manager/files-manager.module';
import { GeneralJournalsModule } from '~modules/general_journals/general-journals.module';
import { UnitsModule } from '~modules/units/units.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { AccountsModule } from '~modules/accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MinioModule,
    AccountsModule,
    AuthModule,
    UnitsModule,
    FilesManagerModule,
    GeneralJournalsModule,
    AdjustmentJournalsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthJwtGuard,
    },
  ],
})
export class AppModule {}
