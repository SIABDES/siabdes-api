import { PaginationResponse } from '~common/types/responses';
import { JournalType } from '../journal.type';

export type GetJournalsResponse = PaginationResponse & {
  _count: number;
  journals: JournalType[];
};
