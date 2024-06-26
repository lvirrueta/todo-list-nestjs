// Dependencies
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// Services
import { AuthService } from 'src/auth/domain/service/auth-sign.service';

// Interface
import { IAccessToken } from 'src/auth/domain/interface/i-access-token';

// DTO
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';

// Constants
import { Public } from '../decorators/public.decorator';
import { Routes } from 'src/common/application/routes/routes.constants';

@ApiTags(Routes.AuthSign.ApiTags)
@Controller(Routes.AuthSign.Controller)
export class SignController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(Routes.AuthSign.SignUp)
  @ApiOperation({ summary: 'Register to the application', description: 'return an access token & refresh token' })
  async signIp(@Body() dto: SignUpDto): Promise<IAccessToken> {
    return this.authService.createUser(dto);
  }

  @Public()
  @Post(Routes.AuthSign.SignIn)
  @ApiOperation({ summary: 'Login to the application', description: 'return an access token & refresh token' })
  async signUp(@Body() dto: SignInDto): Promise<IAccessToken> {
    return this.authService.signUp(dto);
  }
}
