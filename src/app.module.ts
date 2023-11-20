import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from '~modules/auth/auth.module';
import { AuthJwtGuard } from '~modules/auth/guards';
import { GeneralJournalsModule } from '~modules/general_journals/general-journals.module';
import { UnitsModule } from '~modules/units/units.module';
import { PrismaModule } from './lib/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UnitsModule,
    GeneralJournalsModule,
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
