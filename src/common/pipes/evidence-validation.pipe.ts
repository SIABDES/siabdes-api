import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export function buildEvidenceValidationPipe() {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'image',
    })
    .addMaxSizeValidator({
      maxSize: 1 * 1024 * 1024,
      message: 'File harus berukuran maksimal 1 MB',
    })
    .build({
      fileIsRequired: false,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
}
