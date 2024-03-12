import { Module } from '@nestjs/common';
import { PpnV2Controller, UnitPpnV2Controller } from './controllers';
import { PpnV2Service } from './services';

@Module({
  controllers: [PpnV2Controller, UnitPpnV2Controller],
  providers: [PpnV2Service],
})
export class PpnV2Module {}
