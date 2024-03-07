import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthUserRole, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { AuthLoginDto, AuthRegisterDto } from '../dto';
import { IAuthService } from '../interfaces';
import { JwtPayload, JwtToken, JwtUserPayload } from '../types';
import { PrismaService } from '~lib/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthLoginResponse } from '../types/responses';
import { Env } from '~common/types';
import { PrismaClientExceptionCode } from '~common/exceptions';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService<Env>,
  ) {}

  async refresh(payload: JwtUserPayload): Promise<JwtToken> {
    const token = await this.generateTokens(payload);

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async generateTokens(payload: JwtUserPayload): Promise<JwtToken> {
    const refreshSecret = this.config.getOrThrow('JWT_REFRESH_SECRET');
    const refreshExpiresIn =
      this.config.getOrThrow('JWT_REFRESH_EXPIRES_IN') || '1h';

    const jwtPayload: JwtPayload = {
      sub: payload.id,
      bumdesId: payload.bumdesId,
      unitId: payload.unitId,
      role: payload.role,
    };

    const access_token = await this.jwt.signAsync(jwtPayload);

    const refresh_token = await this.jwt.signAsync(jwtPayload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async login(data: AuthLoginDto): Promise<AuthLoginResponse> {
    const user = await this.prisma.authUser.findUnique({
      where: {
        identifier: data.identifier,
      },
      include: {
        bumdes: {
          select: { id: true, name: true },
        },
        bumdesUnit: {
          select: { id: true, name: true, businessType: true },
        },
      },
    });

    if (!user) throw new ForbiddenException('Invalid credentials');

    const isValidPassword = await argon2.verify(user.password, data.password);

    if (!isValidPassword) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.generateTokens({
      id: user.id,
      bumdesId: user.bumdes.id,
      unitId: user.bumdesUnit?.id,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        bumdesId: user.bumdes.id,
        bumdesName: user.bumdes.name,
        unitId: user.bumdesUnit?.id,
        unitName: user.bumdesUnit?.name,
        unitBusinessType: user.bumdesUnit?.businessType,
        role: user.role,
      },
      backendTokens: tokens,
    };
  }

  async register(
    data: AuthRegisterDto,
  ): Promise<{ userId: string; bumdesId: string }> {
    const { identifier, password, bumdes, organization } = data;
    const { name, phone, address } = bumdes;
    const { leader, secretary, treasurer } = organization;

    const hashedPassword = await argon2.hash(password);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const user = await tx.authUser.create({
          data: {
            identifier,
            role: AuthUserRole.BUMDES,
            password: hashedPassword,
          },
        });

        const bumdes = await tx.bumdes.create({
          data: {
            name,
            phone,
            leader,
            secretary,
            treasurer,
            province: address.province,
            regency: address.regency,
            district: address.district,
            village: address.village,
            postalCode: address.postal_code,
            completeAddress: address.complete_address,
            users: {
              connect: { id: user.id },
            },
          },
        });

        return { userId: user.id, bumdesId: bumdes.id };
      });

      return {
        userId: result.userId,
        bumdesId: result.bumdesId,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.UNIQUE_CONSTRAINT_FAILED) {
          throw new ForbiddenException('Identifier already exists');
        }
        if (error.code === PrismaClientExceptionCode.TRANSACTION_API_ERROR) {
          throw new InternalServerErrorException(
            `Failed to create user or bumdes. Error: ${error.message}`,
          );
        }
        throw new InternalServerErrorException(error.message);
      }
      throw error;
    }
  }
}
