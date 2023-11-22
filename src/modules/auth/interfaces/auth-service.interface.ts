import { AuthLoginDto, AuthRegisterDto } from '../dto';
import { JwtToken, JwtUserPayload } from '../types';
import { AuthLoginResponse } from '../types/responses';

export interface IAuthService {
  login(data: AuthLoginDto): Promise<AuthLoginResponse>;

  register(
    data: AuthRegisterDto,
  ): Promise<{ userId: string; bumdesId: string }>;

  logout(request: Request): Promise<boolean>;

  refresh(payload: JwtUserPayload): Promise<JwtToken>;

  generateTokens(payload: JwtUserPayload): Promise<JwtToken>;
}
