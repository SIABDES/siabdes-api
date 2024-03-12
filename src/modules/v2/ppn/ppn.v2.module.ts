import { Module } from '@nestjs/common';
import { PpnV2Controller } from './controllers';
import { PpnV2Service } from './services';

@Module({
  providers: [PpnV2Service],
  controllers: [PpnV2Controller],
})
export class PpnV2Module {}
