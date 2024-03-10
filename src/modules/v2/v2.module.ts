import { Module } from '@nestjs/common';
import { PpnV2Module } from './ppn/ppn.v2.module';
import { Pph21V2Module } from './pph21/pph21.v2.module';
import { AccountingV2Module } from './accounting/accounting.v2.module';

@Module({
  imports: [PpnV2Module, Pph21V2Module, AccountingV2Module],
})
export class V2Module {}
