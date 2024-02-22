import { AuthUserRole, BumdesUnitBusinessType } from '@prisma/client';
import { JwtToken } from '../jwt-tokens.type';

export type AuthLoginResponse = {
  user: {
    id: string;
    bumdesId: string;
    bumdesName: string;
    unitId?: string;
    unitName?: string;
    unitBusinessType?: BumdesUnitBusinessType;
    role: AuthUserRole;
  };
  backendTokens: JwtToken;
};

export type AuthRefreshTokenResponse = JwtToken;
