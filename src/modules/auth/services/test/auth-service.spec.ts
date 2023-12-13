import { Test } from '@nestjs/testing';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AuthController } from '~modules/auth/controllers';
import { AuthService } from '../auth.service';
import { AuthLoginDto } from '~modules/auth/dto';
import { ForbiddenException } from '@nestjs/common';
import { PrismaModule } from '~lib/prisma/prisma.module';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AuthService],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return "Invalid Credentials"', () => {
      const inputCredentials: AuthLoginDto = {
        identifier: 'admin',
        password: 'admin',
      };

      expect(authService).toBeDefined();
      expect(authService.login(inputCredentials)).toThrow(
        new ForbiddenException('Invalid credentials'),
      );
    });
  });
});
