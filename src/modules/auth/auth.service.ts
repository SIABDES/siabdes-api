import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { IAuthService } from './interfaces';
import { JwtPayload, JwtToken } from './types';
import { PrismaService } from '~lib/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async generateTokens(payload: JwtPayload): Promise<JwtToken> {
    const refreshSecret = this.config.getOrThrow('JWT_REFRESH_SECRET');
    const refreshExpiresIn =
      this.config.getOrThrow('JWT_REFRESH_EXPIRES_IN') || '1h';

    const access_token = await this.jwt.signAsync(payload);

    const refresh_token = await this.jwt.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async logout(request: Request): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async login(data: AuthLoginDto): Promise<JwtToken> {
    const user = await this.prisma.authUser.findUnique({
      where: {
        identifier: data.identifier,
      },
      include: {
        bumdes: {
          select: { id: true },
        },
        bumdesUnit: {
          select: { id: true },
        },
      },
    });

    if (!user) throw new ForbiddenException('Invalid credentials');

    const isValidPassword = await argon2.verify(user.password, data.password);

    if (!isValidPassword) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.generateTokens({
      sub: user.id,
      bumdesId: user.bumdes.id,
      unitId: user.bumdesUnit?.id,
      role: user.role,
    });

    return tokens;
  }

  async register(
    data: AuthRegisterDto,
  ): Promise<{ userId: string; bumdesId: string }> {
    const { identifier, password, bumdes } = data;
    const { name, phone, address } = bumdes;

    const hashedPassword = await argon2.hash(password);

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
          province: address.province,
          regency: address.regency,
          district: address.district,
          village: address.village,
          postalCode: address.postal_code,
          completeAddress: address.complete_address,
          user: {
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
  }
}
