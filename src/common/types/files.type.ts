export enum FileResourceLocation {
  JOURNALS = 'journals',
  PPN = 'ppn',
}

export type FileResourceValue =
  (typeof FileResourceLocation)[keyof typeof FileResourceLocation];

export type FileResourceBasePath = `${string}/${string}`;

export type FileResourcePath = `${FileResourceBasePath}/${FileResourceValue}`;

export type FileKeyWithExtension = `${string}.${string}`;

export type FileResourceKey = `${FileResourcePath}/${FileKeyWithExtension}`;

export type FileResponseHeaders = {
  'response-content-disposition'?: {
    type?: 'inline' | 'attachment';
    filename?: string;
  };
};
