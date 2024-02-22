import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaModule } from '~lib/prisma/prisma.module';
import { AuthLoginDto } from '~modules/auth/dto';
import { AuthService } from '../auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PrismaModule,
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return "Invalid Credentials"', async () => {
      const inputCredentials: AuthLoginDto = {
        identifier: 'admin',
        password: 'admin',
      };

      expect(authService).toBeDefined();
      expect(await authService.login(inputCredentials)).toThrow(
        new ForbiddenException('Invalid credentials'),
      );
    });
  });
});
