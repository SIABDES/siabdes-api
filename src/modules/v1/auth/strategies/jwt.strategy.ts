import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { COOKIE_JWT_ACCESS_TOKEN_KEY } from '~modules/v1/auth/constants';
import { JwtPayload, JwtUserPayload } from '../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => {
          let token: string | null = null;
          if (req && req.cookies) {
            token = req.cookies[COOKIE_JWT_ACCESS_TOKEN_KEY];
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtUserPayload> {
    return {
      id: payload.sub,
      bumdesId: payload.bumdesId,
      unitId: payload.unitId,
      role: payload.role,
    };
  }
}
