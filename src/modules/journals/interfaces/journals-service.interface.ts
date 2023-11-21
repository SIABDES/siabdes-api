import { PaginationDto } from '~common/dto';
import {
  CreateJournalDto,
  GetJournalsFilterDto,
  GetJournalsSortDto,
  UpdateJournalDto,
} from '../dto';
import {
  CreateJournalResponse,
  DeleteJournalResponse,
  GetJournalDetailsResponse,
  GetJournalsResponse,
  UpdateJournalReponse,
} from '../types/responses';

export interface IJournalsService {
  createJournal(
    unitId: string,
    evidenceFile: Express.Multer.File,
    data: CreateJournalDto,
  ): Promise<CreateJournalResponse>;

  updateJournal(
    unitId: string,
    journalId: string,
    data: UpdateJournalDto,
  ): Promise<UpdateJournalReponse>;

  getJournals(
    unitId: string,
    sort?: GetJournalsSortDto,
    filter?: GetJournalsFilterDto,
    pagination?: PaginationDto,
  ): Promise<GetJournalsResponse>;

  getJournalDetails(
    unitId: string,
    journalId: string,
  ): Promise<GetJournalDetailsResponse>;

  deleteJournal(
    unitId: string,
    journalId: string,
  ): Promise<DeleteJournalResponse>;
}
