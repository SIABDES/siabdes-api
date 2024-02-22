import { AuthUserRole } from '@prisma/client';

type CorePayload = {
  bumdesId: string;
  unitId?: string;
  role: AuthUserRole;
};

export type JwtPayload = {
  sub: string;
} & CorePayload;

export type JwtUserPayload = {
  id: string;
} & CorePayload;
