import { BadRequestException } from '@nestjs/common';
import * as mime from 'mime-types';
import { nanoid } from 'nanoid';
import { CommonFilePathDto } from '~common/dto';
import {
  FileKeyWithExtension,
  FileResourceBasePath,
  FileResourceKey,
  FileResourcePath,
} from '~common/types';

export function getBaseResourcePath(
  dto: CommonFilePathDto,
): FileResourceBasePath {
  if (!dto.unit_id || !dto.bumdes_id) {
    throw new BadRequestException('unit_id and bumdes_id are required');
  }

  return `${dto.bumdes_id}/${dto.unit_id}`;
}

export function getResourcePath(dto: CommonFilePathDto): FileResourcePath {
  return `${getBaseResourcePath(dto)}/${dto.resource}`;
}

export function generateFileKey(
  file: Express.Multer.File,
  nanoSize?: number,
): FileKeyWithExtension {
  return `${nanoid(nanoSize || 27)}.${mime.extension(file.mimetype)}`;
}

export function generateResourceKey(
  file: Express.Multer.File,
  dto: CommonFilePathDto,
): FileResourceKey {
  return `${getResourcePath(dto)}/${generateFileKey(file)}` as const;
}
