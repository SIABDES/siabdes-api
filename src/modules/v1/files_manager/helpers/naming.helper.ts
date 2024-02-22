import { nanoid } from 'nanoid';

export function generateFileName(file: Express.Multer.File): string {
  const extension = file.originalname.split('.').pop();
  return `${nanoid(27)}.${extension}`;
}
