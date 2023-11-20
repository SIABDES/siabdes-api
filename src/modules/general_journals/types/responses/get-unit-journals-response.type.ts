import { GeneralJournalDetails } from '../transaction-details.type';

export type GetUnitJournalsResponse = {
  _count: number;
  journals: GeneralJournalDetails[];
};
