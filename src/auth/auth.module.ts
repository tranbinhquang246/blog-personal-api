import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { UsersModule } from '@/users/users.module';
import { jwtSecretKey } from '@/constants/jwtConstants';
import { LocalStrategy } from '@/auth/strategy/local.strategy';
import { JwtStrategy } from '@/auth/strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecretKey.secret,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
