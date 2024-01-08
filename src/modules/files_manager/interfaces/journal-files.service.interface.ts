import { JournalFileInputType } from '../types';

export interface IJournalFilesService {
  upload(args: JournalFileInputType): Promise<string | null>;

  getUrl(journalId: string): Promise<string>;
}
