import { GeneralJournalBrief } from '../transaction-details.type';

export type GetUnitJournalsResponse = {
  _count: number;
  journals: GeneralJournalBrief[];
};
