import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const createdTag = await this.prisma.tag.create({
        data: {
          name: createTagDto.name,
          publicStatus: createTagDto.isPublic,
        },
      });
      return createdTag;
    } catch (error) {
      throw new BadRequestException('Create failed');
    }
  }

  async findAll() {
    try {
      const tags = await this.prisma.tag.findMany({
        include: {
          _count: {
            select: { post: true },
          },
        },
      });
      return tags;
    } catch (error) {
      throw new NotFoundException('Not found');
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const updatedTag = await this.prisma.tag.update({
        where: { id: id },
        data: {
          name: updateTagDto.name,
          publicStatus: updateTagDto.isPublic,
        },
      });
      return updatedTag;
    } catch (error) {
      throw new BadRequestException('Update failed');
    }
  }

  async remove(id: string) {
    try {
      const deletedTag = await this.prisma.tag.delete({
        where: { id: id },
      });
      return deletedTag;
    } catch (error) {
      throw new BadRequestException('Delete failed');
    }
  }
}
