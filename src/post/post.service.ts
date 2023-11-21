import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(userId: string, createPostDto: CreatePostDto) {
    try {
      const created = await this.prisma.post.create({
        data: {
          userId: userId,
          content: createPostDto.content,
          title: createPostDto.title,
        },
      });
      const postTagData = createPostDto.tag
        .filter((tag) => tag !== '')
        .map((tag) => ({
          postId: created.id,
          tagId: tag,
        }));

      if (postTagData && postTagData.length > 0) {
        await this.prisma.postTag.createMany({
          data: [...postTagData],
        });
      }

      if (createPostDto.category) {
        await this.prisma.postCategory.create({
          data: { categoryId: createPostDto.category, postId: created.id },
        });
      }

      return created;
    } catch (error) {
      throw new BadRequestException('Create failed');
    }
  }

  async findAll() {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          AND: [],
        },
        include: {
          category: {
            include: {
              category: true,
            },
          },
          tag: {
            include: {
              tag: true,
            },
          },
          user: {
            include: {
              profile: true,
            },
          },
          comment: true,
        },
        // skip: (filterPostDto.page - 1) * 5 || 0,
        // take: 5,
        orderBy: { createdAt: 'desc' },
      });
      return posts;
    } catch (error) {
      throw new NotFoundException('Not found');
    }
  }

  async findOne(id: string) {
    try {
      const posts = await this.prisma.post.findUnique({
        where: { id: id },
        include: {
          category: {
            include: {
              category: true,
            },
          },
          tag: {
            include: {
              tag: true,
            },
          },
          user: {
            include: {
              profile: true,
            },
          },
          comment: true,
        },
      });
      return posts;
    } catch (error) {
      throw new NotFoundException('Not found');
    }
  }

  async getCreationData() {
    try {
      const categoryPublic = await this.prisma.category.findMany({
        where: {
          publicStatus: true,
        },
      });
      const tagPublic = await this.prisma.tag.findMany({
        where: {
          publicStatus: true,
        },
      });

      return {
        category: categoryPublic,
        tag: tagPublic,
      };
    } catch (error) {
      throw new BadRequestException('Delete failed');
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const updatedPost = await this.prisma.post.update({
        where: { id: id },
        data: { title: updatePostDto.title, content: updatePostDto.content },
      });

      if (updatePostDto.categoryPostId) {
        await this.prisma.postCategory.update({
          where: { id: updatePostDto.categoryPostId.id },
          data: {
            categoryId: updatePostDto.categoryPostId.category,
          },
        });
      }

      await this.prisma.postTag.deleteMany({ where: { postId: id } });

      const postTagData = updatePostDto.tag
        .filter((tag) => tag !== '')
        .map((tag) => ({
          postId: id,
          tagId: tag,
        }));

      if (postTagData && postTagData.length > 0) {
        await this.prisma.postTag.createMany({
          data: [...postTagData],
        });
      }

      return updatedPost;
    } catch (error) {
      throw new BadRequestException('Delete failed');
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.post.delete({
        where: { id: id },
      });
      return deleted;
    } catch (error) {
      throw new BadRequestException('Delete failed');
    }
  }
}
