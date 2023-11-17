import { AuthUserRole } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  bumdesId: string;
  unitId?: string;
  role: AuthUserRole;
};
