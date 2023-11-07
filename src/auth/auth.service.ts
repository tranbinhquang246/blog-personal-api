import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: AuthDto) {
    const { password, email } = data;
    const user = await this.usersService.findUserWithEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      //   const { password, ...result } = user;
      return user;
    }
    throw new ForbiddenException('Password is incorrect');
  }

  async login(data: AuthDto) {
    const dataUser = await this.usersService.findUserWithEmail(data.email);
    const payload = {
      id: dataUser.id,
      email: dataUser.email,
      role: dataUser.role,
    };

    return {
      user: dataUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}
