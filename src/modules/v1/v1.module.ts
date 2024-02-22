import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { BumdesModule } from './bumdes/bumdes.module';
import { FilesManagerModule } from './files_manager/files-manager.module';
import { JournalsModule } from './journals/journals.module';
import { LedgersModule } from './ledgers/ledgers.module';
import { UnitsModule } from './units/units.module';
import { WtbModule } from './wtb/wtb.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthJwtGuard } from './auth/guards';

@Module({
  imports: [
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
      provide: APP_GUARD,
      useClass: AuthJwtGuard,
    },
  ],
})
export class V1Module {}
