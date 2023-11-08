import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const createdCategory = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          publicStatus: createCategoryDto.isPublic,
        },
      });
      return createdCategory;
    } catch (error) {
      throw new BadRequestException('Create failed');
    }
  }

  async findAll() {
    try {
      const category = await this.prisma.category.findMany({
        include: {
          _count: {
            select: { post: true },
          },
        },
      });
      return category;
    } catch (error) {
      throw new NotFoundException('Not found');
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id: id },
        data: {
          name: updateCategoryDto.name,
          publicStatus: updateCategoryDto.isPublic,
        },
      });
      return updatedCategory;
    } catch (error) {
      throw new BadRequestException('Update failed');
    }
  }

  async removeCategory(id: string) {
    try {
      const deletedCategory = await this.prisma.category.delete({
        where: { id: id },
      });
      return deletedCategory;
    } catch (error) {
      throw new BadRequestException('Delete failed');
    }
  }
}
