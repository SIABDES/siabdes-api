import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser, Public } from '../decorators';
import { AuthLoginDto, AuthRegisterDto } from '../dto';
import { AuthService } from '../services/auth.service';
import { JwtUserPayload } from '../types';
import { AuthLoginResponse } from '../types/responses';

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() data: AuthLoginDto) {
    const result = await this.authService.login(data);

    this.logger.log(`Login success for user '${data.identifier}'`);

    return new ResponseBuilder<AuthLoginResponse>()
      .setMessage('Login success')
      .setStatusCode(HttpStatus.CREATED)
      .setData(result)
      .build();
  }

  @Public()
  @Post('register')
  async register(@Body() data: AuthRegisterDto) {
    const result = await this.authService.register(data);

    this.logger.log(`Register success for user '${data.identifier}'`);

    return new ResponseBuilder()
      .setMessage('Register success')
      .setStatusCode(HttpStatus.CREATED)
      .setData(result)
      .build();
  }

  @Get('me')
  async me(@GetUser() user: JwtUserPayload) {
    this.logger.log(`Get user data for user '${user.id}'`);

    return new ResponseBuilder()
      .setMessage('Success')
      .setData({
        id: user,
        bumdesId: user.bumdesId,
        unitId: user.unitId,
        role: user.role,
      })
      .build();
  }

  @Post('refresh')
  async refresh(@GetUser() user: JwtUserPayload) {
    console.log(user);

    const result = await this.authService.refresh(user);

    this.logger.log(`Refresh token success`);

    return new ResponseBuilder()
      .setMessage('Refresh token success')
      .setData(result)
      .build();
  }
}
