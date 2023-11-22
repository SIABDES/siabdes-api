import { PaginationResponse } from '~common/types/responses';
import { JournalDetailsWithOptionalItemsType } from '../journal.type';

export type GetJournalsResponse = PaginationResponse & {
  _count: number;
  journals: JournalDetailsWithOptionalItemsType[];
};
