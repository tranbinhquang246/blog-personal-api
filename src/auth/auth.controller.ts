import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { RegisterUserDto } from '@/users/dto/registerUser.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async login(@Body() request: AuthDto) {
    return await this.authService.login(request);
  }

  @Post('sign-up')
  async signUp(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.createUser(registerUserDto);
  }
}
