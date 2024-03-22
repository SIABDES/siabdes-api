import { JournalDetailsV2Type } from '../schemas';
import { JournalOverviewV2Type } from '../types';

export type AddJournalV2Response = {
  id: string;
  created_at: Date;
};

export type UpdateJournalV2Response = {
  id: string;
  updated_at: Date;
};

export type DeleteJournalV2Response = {
  id: string;
  hard_delete: boolean;
  deleted_at: Date;
};

export type GetJournalByIdV2Response = JournalDetailsV2Type;

export type GetManyJournalsV2Response = {
  _count: number;
  journals: (JournalOverviewV2Type | JournalDetailsV2Type)[];
};
