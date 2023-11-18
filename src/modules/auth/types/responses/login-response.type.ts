import { AuthUserRole } from '@prisma/client';
import { JwtToken } from '../jwt-tokens.type';

export type AuthLoginResponse = {
  user: {
    id: string;
    bumdesId: string;
    unitId?: string;
    role: AuthUserRole;
  };
  backendTokens: JwtToken;
};
