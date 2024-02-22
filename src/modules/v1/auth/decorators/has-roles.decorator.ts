import { AuthUserRole } from '@prisma/client';
import { ROLES_KEY } from '../constants';
import { AuthRoleGuard, AuthJwtGuard } from '../guards';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export const HasRoles = (...roles: AuthUserRole[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthJwtGuard, AuthRoleGuard),
  );
};
