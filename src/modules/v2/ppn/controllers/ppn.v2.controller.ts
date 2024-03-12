import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { OptionalGetManyPpnV2Dto } from '../dto';
import { PpnV2Service } from '../services/ppn.v2.service';

// TODO: Add super admin only decorator
@Controller({
  path: 'ppn',
  version: '2',
})
export class PpnV2Controller {
  private readonly logger: Logger = new Logger(PpnV2Controller.name);

  constructor(private readonly ppnService: PpnV2Service) {}

  @Get()
  async getListPpn(@Query() dto?: OptionalGetManyPpnV2Dto) {
    this.logger.log(`Getting list PPN for unit: ${dto.unit_id}`);

    const result = await this.ppnService.getListPpn(dto);

    this.logger.log(`List PPN has been retrieved`);

    return result;
  }

  @Get(':id')
  async getPpnById(@Param('id') ppnId: string) {
    this.logger.log(`Getting PPN by ID: ${ppnId}`);

    const result = await this.ppnService.getById(ppnId);

    this.logger.log(`PPN has been retrieved`);

    return result;
  }
}
