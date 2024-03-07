import { UnauthorizedException } from '@nestjs/common';
import { CoreUserPayload, JwtUserPayload } from '../types';
import { AuthUserRole } from '@prisma/client';

type AuthorizationDto = {
  user: JwtUserPayload;
  expectedUser?: CoreUserPayload;
  message?: string;
};

const defaultMessages = {
  UNIT: 'Only Unit can access this resource',
  BUMDES: 'Only Bumdes can access this resource',
  BUMDES_OR_UNIT: 'Only Bumdes or Unit can access this resource',
  SUPER_ADMIN: 'Only Super Admin can access this resource',
  NOT_SAME_UNIT: 'You are not allowed to access this resource',
  NOT_SAME_BUMDES: 'You are not allowed to access this resource',
};

export function isUnitOnly({ user, message }: AuthorizationDto): boolean {
  if (!user.unitId || user.role !== AuthUserRole.UNIT)
    throw new UnauthorizedException(message || defaultMessages.UNIT);

  return true;
}

export function isSameUnit({
  user,
  expectedUser,
  message,
}: AuthorizationDto): boolean {
  if (user.unitId !== expectedUser?.unitId)
    throw new UnauthorizedException(message || defaultMessages.NOT_SAME_UNIT);

  return true;
}

export function isBumdesOnly({ user, message }: AuthorizationDto): boolean {
  if (!user.bumdesId || user.role !== AuthUserRole.BUMDES)
    throw new UnauthorizedException(message || defaultMessages.BUMDES);

  return true;
}

export function isSameBumdes({
  user,
  expectedUser,
  message,
}: AuthorizationDto): boolean {
  if (user.bumdesId !== expectedUser?.bumdesId)
    throw new UnauthorizedException(message || defaultMessages.NOT_SAME_BUMDES);

  return true;
}

export function isBumdesOrUnit({ user, message }: AuthorizationDto): boolean {
  if (!user.bumdesId && !user.unitId)
    throw new UnauthorizedException(message || defaultMessages.BUMDES_OR_UNIT);

  if (user.role !== AuthUserRole.BUMDES && user.role !== AuthUserRole.UNIT)
    throw new UnauthorizedException(message || defaultMessages.BUMDES_OR_UNIT);

  return true;
}

export function isSameBumdesAndUnit({
  user,
  expectedUser,
  message,
}: AuthorizationDto): boolean {
  if (
    user.bumdesId !== expectedUser?.bumdesId &&
    user.unitId !== expectedUser?.unitId
  )
    throw new UnauthorizedException(message || defaultMessages.BUMDES_OR_UNIT);

  return true;
}

export function isSuperAdminOnly({ user, message }: AuthorizationDto): boolean {
  if (user.role === AuthUserRole.SUPER_ADMIN) return true;

  throw new UnauthorizedException(message || defaultMessages.SUPER_ADMIN);
}
