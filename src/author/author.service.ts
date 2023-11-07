import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async createAuthorInfo(createAuthorDto: CreateAuthorDto) {
    try {
      const authorInfo = await this.prisma.aboutAuthor.create({
        data: createAuthorDto,
      });
      return authorInfo;
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }

  async getAllAuthorInfo() {
    try {
      const authors = await this.prisma.aboutAuthor.findMany({
        include: { lifeProcess: true },
      });
      return authors;
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }

  async getAuthorInfo(id: string) {
    try {
      const author = await this.prisma.aboutAuthor.findUnique({
        where: { id: id },
      });
      return author;
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }

  async updateAuthorInfo(id: string, updateAuthorDto: UpdateAuthorDto) {
    try {
      const updatedAuthor = await this.prisma.aboutAuthor.update({
        where: { id: id },
        data: updateAuthorDto,
      });
      return updatedAuthor;
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }

  async deleteAuthorInfo(id: string) {
    try {
      const deletedAuthor = await this.prisma.aboutAuthor.delete({
        where: { id: id },
      });
      return deletedAuthor;
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }
}
