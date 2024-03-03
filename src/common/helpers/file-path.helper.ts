import * as mime from 'mime-types';
import { nanoid } from 'nanoid';
import { CommonFilePathDto } from '~common/dto';

type AvailableResourceLocation = 'journals' | 'ppn';

type GetResourceBasePathArgs = {
  resource: AvailableResourceLocation;
  path: CommonFilePathDto;
};

type GetResourcePathArgs = GetResourceBasePathArgs & {
  fileKey: string;
};

type GenerateResourcePathArgs = GetResourceBasePathArgs & {
  file: Express.Multer.File;
};

export function getResourceBasePath(args: GetResourceBasePathArgs) {
  const { resource, path } = args;

  return `${path.bumdes_id}/${path.unit_id}/${resource}` as const;
}

export function getResourcePath(args: GetResourcePathArgs) {
  const { fileKey, ...rest } = args;
  const basePath = getResourceBasePath(rest);

  return `${basePath}/${fileKey}` as const;
}

export function generateResourcePath(args: GenerateResourcePathArgs) {
  const { file, ...rest } = args;

  if (rest.path.key) return rest.path.key;

  const basePath = getResourceBasePath(rest);

  const fileKey = `${nanoid(27)}.${mime.extension(file.mimetype)}` as const;

  return `${basePath}/${fileKey}` as const;
}
