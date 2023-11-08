import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Auth } from '@/auth/decorators/auth.decorators';
import { Role } from '@/auth/roles/roles.enum';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Auth(Role.Admin)
  @Post()
  async create(@Res() response, @Body() createTagDto: CreateTagDto) {
    const createdTag = await this.tagService.create(createTagDto);
    return response.status(HttpStatus.OK).send(createdTag);
  }

  @Auth(Role.Admin)
  @Get()
  async findAll(@Res() response) {
    const tags = await this.tagService.findAll();
    return response.status(HttpStatus.OK).send(tags);
  }

  @Auth(Role.Admin)
  @Patch(':id')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    const updatedTag = await this.tagService.update(id, updateTagDto);
    return response.status(HttpStatus.OK).send(updatedTag);
  }

  @Auth(Role.Admin)
  @Delete(':id')
  async remove(@Res() response, @Param('id') id: string) {
    const deletedTag = await this.tagService.remove(id);
    return response.status(HttpStatus.OK).send(deletedTag);
  }
}
