/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './models/user.model';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public login(@Body() user:Pick<User, 'email' | 'password'>) {
    return this.authService.login(user.email, user.password)
  }

  @Post('register')
  public register(@Body() user:Omit<User, 'id'>) {
    return this.authService.register(user)
  }
}
