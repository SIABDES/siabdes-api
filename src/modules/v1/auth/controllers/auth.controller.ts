import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { GetUser, Public } from '~modules/v1/auth/decorators';
import { AuthLoginDto, AuthRegisterDto } from '../dto';
import { AuthService } from '../services/auth.service';
import { JwtUserPayload } from '../types';

@Controller({
  path: 'auth',
  version: ['1', '2'],
})
export class AuthController {
  private logger: Logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() data: AuthLoginDto) {
    const result = await this.authService.login(data);

    this.logger.log(`Login success for user '${data.identifier}'`);

    return result;
  }

  @Public()
  @Post('register')
  async register(@Body() data: AuthRegisterDto) {
    const result = await this.authService.register(data);

    this.logger.log(`Register success for user '${data.identifier}'`);

    return result;
  }

  @Get('me')
  async me(@GetUser() user: JwtUserPayload) {
    this.logger.log(`Get user data for user '${user.id}'`);

    const result = {
      id: user.id,
      bumdesId: user.bumdesId,
      unitId: user.unitId,
      role: user.role,
    };

    return result;
  }

  @Post('refresh')
  async refresh(@GetUser() user: JwtUserPayload) {
    console.log(user);

    const result = await this.authService.refresh(user);

    this.logger.log(`Refresh token success`);

    return result;
  }
}
