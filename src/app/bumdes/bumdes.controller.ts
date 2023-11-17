import { Controller, Get, Post } from '@nestjs/common';
import { BumdesService } from './bumdes.service';

@Controller('bumdes')
export class BumdesController {
  constructor(private readonly bumdeService: BumdesService) {}
}
