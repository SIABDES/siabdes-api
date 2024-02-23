import { Module } from '@nestjs/common';
import { PpnV2Controller } from './controllers/ppn.v2.controller';
import { PpnV2Service } from './services/ppn.v2.service';
import { PpnFileV2Service } from './services/ppn-file.v2.service';

@Module({
  providers: [PpnV2Service, PpnFileV2Service],
  controllers: [PpnV2Controller],
})
export class PpnV2Module {}
