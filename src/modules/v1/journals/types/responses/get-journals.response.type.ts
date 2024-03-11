import { PaginationResponse } from '~common/responses';
import { JournalDetailsWithOptionalItemsType } from '../journal.type';

export type GetJournalsResponse = PaginationResponse & {
  _count: number;
  journals: JournalDetailsWithOptionalItemsType[];
};
