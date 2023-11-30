import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export function buildValidationForEvidence() {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'image',
    })
    .addMaxSizeValidator({
      maxSize: 1 * 1024 * 1024,
      message: 'File size must be less than or equals 1MB',
    })
    .build({
      fileIsRequired: false,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
}
