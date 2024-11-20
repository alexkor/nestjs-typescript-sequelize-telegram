
import { Body, Controller, Post, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('scriptLogin')
  ScriptSignIn(@Query() signInInitData: string) {
    return this.authService.ScriptSignIn(signInInitData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('buttonLogin')
  ButtonSignIn(@Query() signInInitData: string) {
    return this.authService.ButtonSignIn(signInInitData);
  }
}
