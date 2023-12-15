import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { MinioModule } from '~lib/minio/minio.module';
import { AccountsModule } from '~modules/accounts/accounts.module';
import { AuthModule } from '~modules/auth/auth.module';
import { AuthJwtGuard } from '~modules/auth/guards';
import { FilesManagerModule } from '~modules/files_manager/files-manager.module';
import { UnitsModule } from '~modules/units/units.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { JournalsModule } from '~modules/journals/journals.module';
import { LedgersModule } from '~modules/ledgers/ledgers.module';
import { WtbModule } from '~modules/wtb/wtb.module';
import { BumdesModule } from '~modules/bumdes/bumdes.module';

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
    JournalsModule,
    LedgersModule,
    WtbModule,
    BumdesModule,
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
