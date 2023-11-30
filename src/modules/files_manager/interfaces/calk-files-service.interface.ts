export interface ICalkFilesService {
  uploadCALKFile(
    file: Express.Multer.File,
    unitId: string,
    bumdesId: string,
  ): Promise<string>;

  getListCALKFilesURLs(unitId: string, bumdesId: string): Promise<string[]>;

  deleteCALKFile(fileKey: string): Promise<void>;
}
