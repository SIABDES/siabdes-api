import { AuthLoginDto, AuthRegisterDto } from '../dto';
import { JwtPayload, JwtToken } from '../types';
import { AuthLoginResponse } from '../types/responses';

export interface IAuthService {
  login(data: AuthLoginDto): Promise<AuthLoginResponse>;

  register(
    data: AuthRegisterDto,
  ): Promise<{ userId: string; bumdesId: string }>;

  logout(request: Request): Promise<boolean>;

  generateTokens(payload: JwtPayload): Promise<JwtToken>;
}
