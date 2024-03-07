import { AuthUserRole } from '@prisma/client';

export type CoreUserPayload = {
  bumdesId?: string;
  unitId?: string;
  kecamatanId?: string;
  kabupatenId?: string;
  role: AuthUserRole;
};

export type JwtPayload = {
  sub: string;
} & CoreUserPayload;

export type JwtUserPayload = {
  id: string;
} & CoreUserPayload;
