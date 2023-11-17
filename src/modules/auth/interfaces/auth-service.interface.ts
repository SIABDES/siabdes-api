import { AuthLoginDto, AuthRegisterDto } from '../dto';
import { JwtPayload, JwtToken } from '../types';

export interface IAuthService {
  login(data: AuthLoginDto): Promise<JwtToken>;

  register(
    data: AuthRegisterDto,
  ): Promise<{ userId: string; bumdesId: string }>;

  logout(request: Request): Promise<boolean>;

  generateTokens(payload: JwtPayload): Promise<JwtToken>;
}
