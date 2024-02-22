import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnitsConfiguration } from './types';

@Injectable()
export class UnitsConfig implements OnModuleInit {
  private data: UnitsConfiguration = {
    PPH21_PERIOD_MONTH: 1,
    PPH21_PERIOD_YEAR: new Date().getFullYear(),
  };

  constructor(private config: ConfigService<UnitsConfiguration>) {}

  onModuleInit() {
    this.data.PPH21_PERIOD_MONTH = this.config.get('PPH21_PERIOD_MONTH');
    this.data.PPH21_PERIOD_YEAR = this.config.get('PPH21_PERIOD_YEAR');
  }

  get periodMonth() {
    return this.data.PPH21_PERIOD_MONTH;
  }

  get periodYear() {
    return this.data.PPH21_PERIOD_YEAR;
  }
}
