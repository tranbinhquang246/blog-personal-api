import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '@/users/decorators/users.decorator';
import { Auth } from '@/auth/decorators/auth.decorators';
import { Role } from '@/auth/roles/roles.enum';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth(Role.Admin)
  @Post()
  async create(
    @Res() response,
    @User('id') id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    const created = await this.postService.create(id, createPostDto);
    return response.status(HttpStatus.OK).send(created);
  }

  @Get()
  async findAll(@Res() response) {
    const posts = await this.postService.findAll();
    return response.status(HttpStatus.OK).send(posts);
  }

  @Get('creation-data')
  async getCreationData(@Res() response) {
    const creationData = await this.postService.getCreationData();
    return response.status(HttpStatus.OK).send(creationData);
  }

  @Get(':id')
  async findOne(@Res() response, @Param('id') id: string) {
    const post = await this.postService.findOne(id);
    return response.status(HttpStatus.OK).send(post);
  }

  @Auth(Role.Admin)
  @Patch(':id')
  update(
    @Res() response,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const updatedPost = this.postService.update(id, updatePostDto);
    return response.status(HttpStatus.OK).send(updatedPost);
  }

  @Auth(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
