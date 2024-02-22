import { JournalMetadata } from '../metadata.type';

export type GetUnitMetadataResponse = {
  created_at: Date;
  journals: {
    first_journal?: JournalMetadata;
  };
};
