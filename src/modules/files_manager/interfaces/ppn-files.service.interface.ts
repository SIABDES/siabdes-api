export interface IPpnFilesService {
  uploadPpnEvidence(
    unitId: string,
    bumdesId: string,
    evidence: Express.Multer.File,
  ): Promise<string>;

  getPpnEvidenceUrl(evidenceKey: string): Promise<string>;
}
