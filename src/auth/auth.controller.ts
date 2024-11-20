
import { Controller, Post, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './Public.decorator';
import { ScriptSignInUserDto } from './dto/ScriptSignInUserDto';
import { ButtonSignInUserDto } from './dto/ButtonSignInUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('scriptLogin')
  ScriptSignIn(@Query() signInInitData: ScriptSignInUserDto) {
    return this.authService.ScriptSignIn(signInInitData);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('buttonLogin')
  ButtonSignIn(@Query() signInInitData: ButtonSignInUserDto) {
    return this.authService.ButtonSignIn(signInInitData);
  }
}
