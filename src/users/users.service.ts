import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/prisma/prisma.service';
import { RegisterUserDto } from '@/users/dto/registerUser.dto';
import { UpdateInfoDto } from './dto/update-profile.dto';

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

  async findUserWithEmail(email: string): Promise<User> {
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

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { profile: true },
    });
    return users;
  }

  async findUserWithId(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        profile: true,
      },
    });
    return user;
  }

  async updatePassword(id: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const updateUser = await this.prisma.user.update({
      where: { id: id },
      data: { password: hashedPassword },
    });
    return updateUser;
  }

  async getProfileUser(id: string) {
    const profileUser = await this.prisma.profile.findUnique({
      where: { userId: id },
    });
    return profileUser;
  }

  async updateProfileUser(
    id: string,
    updateProfileUserDto: UpdateInfoDto,
    avatar: Express.Multer.File,
  ) {
    if (avatar) {
      const updateUserInfo = await this.prisma.profile.update({
        where: { userId: id },
        data: {
          avatar: `${process.env.URL_PICTURE_AVATAR}${avatar.filename}`,
        },
      });
      return updateUserInfo;
    }
    const updateUserInfo = await this.prisma.profile.update({
      where: { userId: id },
      data: updateProfileUserDto,
    });
    return updateUserInfo;
  }

  async deleteUser(id: string) {
    const deleteUser = await this.prisma.user.delete({
      where: { id: id },
      include: { profile: true },
    });
    return deleteUser;
  }
}
