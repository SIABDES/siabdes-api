import { OptionalPaginationDto } from '~common/dto';
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
    data: CreateJournalDto,
    evidenceFile?: Express.Multer.File,
  ): Promise<CreateJournalResponse>;

  updateJournal(
    unitId: string,
    journalId: string,
    data: UpdateJournalDto,
    evidenceFile?: Express.Multer.File,
  ): Promise<UpdateJournalReponse>;

  getJournals(
    unitId: string,
    sort?: GetJournalsSortDto,
    filter?: GetJournalsFilterDto,
    pagination?: OptionalPaginationDto,
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
