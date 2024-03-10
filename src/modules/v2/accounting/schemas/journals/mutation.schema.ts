import { JournalV2Schema } from './base.schema';

export const AddJournalV2Schema = JournalV2Schema.omit({
  evidence: true,
});

export const UpdateJournalV2Schema = JournalV2Schema.omit({
  unit_id: true,
  evidence: true,
});
