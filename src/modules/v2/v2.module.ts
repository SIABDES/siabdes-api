import { Module } from '@nestjs/common';
import { PpnV2Module } from './ppn/ppn.v2.module';

@Module({
  imports: [PpnV2Module],
})
export class V2Module {}
