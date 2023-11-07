import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/prisma/prisma.service';
import { RegisterUserDto } from '@/users/dto/registerUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: RegisterUserDto): Promise<User> {
    const { email, password } = data;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          role: 'user',
        },
      });

      await this.prisma.profile.create({
        data: { userId: newUser.id },
      });

      return newUser;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException(`Email already exist`);
        }
      }

      throw new BadRequestException(`Request Failed`);
    }
  }

  async findUserWithEmail(email: string) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!findUser) {
      throw new NotFoundException(`User does not exist`);
    }
    return findUser;
  }
}
