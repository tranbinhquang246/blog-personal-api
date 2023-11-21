import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import fs = require('fs');
import { UsersService } from './users.service';
import { User } from './decorators/users.decorator';
import { Auth } from '@/auth/decorators/auth.decorators';
import { Role } from '@/auth/roles/roles.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateInfoDto } from './dto/update-profile.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const fileName = `${file.originalname}-${uniqueSuffix}${ext}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};

@Controller('users')
export class UsersController {
  constructor(private usersServices: UsersService) {}

  @Auth(Role.Admin)
  @Get('all')
  async getAll(@Res() response) {
    const findAll = await this.usersServices.findAll();
    if (!findAll) {
      throw new NotFoundException('No user found');
    }
    return response.status(HttpStatus.OK).send(findAll);
  }

  @Auth()
  @Get(':userId')
  async getUserWithId(
    @Param('userId') userId: string,
    @Res() response,
    @User('id') id: string,
    @User('role') role: string,
  ) {
    if (id !== userId && role !== Role.Admin) {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    const user = await this.usersServices.findUserWithId(userId);
    if (!user) {
      throw new NotFoundException('No user found');
    }
    return response.status(HttpStatus.OK).send(user);
  }

  @Auth()
  @Patch('change-password/:userId')
  async changePassword(
    @Param('userId') userId: string,
    @Res() response,
    @User('id') id: string,
    @User('role') role: string,
    @Body() data: ChangePasswordDto,
  ) {
    if (id !== userId && role !== 'admin') {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    try {
      const user = await this.usersServices.findUserWithId(id);
      if (user && (await bcrypt.compare(data.oldPassword, user.password))) {
        const editedUser = await this.usersServices.updatePassword(
          id,
          data.password,
        );
        return response.status(HttpStatus.OK).send(editedUser);
      }
      throw new BadRequestException(`Current password is not correct`);
    } catch (error) {
      throw new BadRequestException(
        error?.response?.message || 'Request Failed',
      );
    }
  }
  @Auth()
  @Patch('change-profile/:userId')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async changeProfile(
    @UploadedFile() avatar: Express.Multer.File,
    @Param('userId') userId: string,
    @Res() response,
    @User('id') id: string,
    @User('role') role: string,
    @Body() data: UpdateInfoDto,
  ) {
    if (id !== userId) {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    try {
      const linkAvatarRemove = (await this.usersServices.getProfileUser(userId))
        .avatar;
      const editedUserInfo = await this.usersServices.updateProfileUser(
        userId,
        JSON.parse(JSON.stringify(data)),
        avatar,
      );
      try {
        if (avatar && editedUserInfo && linkAvatarRemove) {
          fs.unlinkSync(`uploads/${linkAvatarRemove.slice(22)}`);
        }
      } catch (error) {}
      return response.status(HttpStatus.OK).send(editedUserInfo);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth()
  @Delete('delete/:userId')
  async deleteUser(
    @Param('userId') userId: string,
    @Res() response,
    @User('id') id: string,
    @User('role') role: string,
  ) {
    if (id !== userId && role !== Role.Admin) {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    try {
      const deleteUser = await this.usersServices.deleteUser(userId);
      const linkRemove = deleteUser.profile.avatar;
      if (linkRemove) {
        fs.unlinkSync(`uploads/${linkRemove.slice(22)}`);
      }
      return response.status(HttpStatus.OK).send(deleteUser);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(error.meta.cause);
      }
      if (error.code === 'ENOENT') {
        return response.status(HttpStatus.OK).send({ message: 'Success' });
      }
      throw new BadRequestException('Request Failed');
    }
  }
}
