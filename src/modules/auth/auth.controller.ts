import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { AuthService } from './auth.service';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser, Public } from './decorators';
import { JwtPayload } from './types';

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() data: AuthLoginDto) {
    const result = await this.authService.login(data);

    this.logger.log(`Login success for user '${data.identifier}'`);

    return new ResponseBuilder()
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
  async me(@GetUser() user: JwtPayload) {
    this.logger.log(`Get user data for user '${user.sub}'`);

    return new ResponseBuilder()
      .setMessage('Success')
      .setData({
        id: user.sub,
        bumdesId: user.bumdesId,
        unitId: user.unitId,
        role: user.role,
      })
      .build();
  }
}
