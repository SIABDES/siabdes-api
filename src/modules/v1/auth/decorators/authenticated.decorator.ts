import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthJwtGuard } from '../guards';

export function Authenticated() {
  return applyDecorators(UseGuards(AuthJwtGuard));
}
