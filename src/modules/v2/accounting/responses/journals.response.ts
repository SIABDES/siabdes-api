import { JournalDetailsV2Type, JournalOverviewV2Type } from '../schemas';

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
  journals: JournalOverviewV2Type[];
};
