import { GeneralJournalDetails } from '../transaction-details.type';

export type GetJournalDetailsResponse = {
  _count: number;
  details: GeneralJournalDetails;
};
