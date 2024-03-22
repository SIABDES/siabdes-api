import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { GetManyJournalsV2Dto } from '../dto';
import { JournalsV2Service } from '../services/journals.v2.service';
import { HasRoles } from '~modules/v1/auth/decorators';
import { AuthUserRole } from '@prisma/client';

// TODO: Add super admin only decorator
@Controller({
  path: 'journals',
  version: '2',
})
@HasRoles(AuthUserRole.SUPER_ADMIN)
export class JournalsV2Controller {
  private readonly logger: Logger = new Logger(JournalsV2Controller.name);

  constructor(private readonly journalsService: JournalsV2Service) {}

  @Get(':id')
  async getJournalById(@Param('id') id: string) {
    this.logger.log(`Mengambil jurnal dengan ID '${id}'`);

    const result = await this.journalsService.getJournalById(id);

    this.logger.log(`Jurnal dengan ID '${id}' berhasil diambil`);

    return result;
  }

  @Get()
  async getJournals(@Query() dto?: GetManyJournalsV2Dto) {
    this.logger.log(`Mengambil daftar jurnal ${JSON.stringify(dto)}`);

    const result = await this.journalsService.getJournals(dto);

    this.logger.log(`Berhasil mengambil ${result._count} jurnal`);

    return result;
  }

  @Get(':id/evidence')
  async getJournalEvidence(@Param('id') id: string) {
    this.logger.log(`Mengambil bukti jurnal dengan ID '${id}'`);

    const result = await this.journalsService.getJournalEvidenceById(id);

    this.logger.log(`Bukti jurnal dengan ID '${id}' berhasil diambil`);

    return result;
  }
}
