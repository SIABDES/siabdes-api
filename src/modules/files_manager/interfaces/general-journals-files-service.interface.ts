export interface IGeneralJournalsFilesService {
  uploadEvidence(
    file: Express.Multer.File,
    bumdesId: string,
    unitId: string,
  ): Promise<string>;

  getEvidenceUrl(journalId: string): Promise<string>;
}
