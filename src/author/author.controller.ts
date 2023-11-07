import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
  NotFoundException,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Auth } from '@/auth/decorators/auth.decorators';
import { Role } from '@/auth/roles/roles.enum';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Auth(Role.Admin)
  @Post()
  async createAuthor(@Res() res, @Body() data: CreateAuthorDto) {
    const createdAuthor = await this.authorService.createAuthorInfo(data);
    if (!createdAuthor) {
      throw new BadRequestException(`Request Failed`);
    }
    return res.status(HttpStatus.OK).send(createdAuthor);
  }

  @Auth(Role.Admin)
  @Get()
  async findAllAuthor(@Res() response) {
    const authors = await this.authorService.getAllAuthorInfo();
    if (!authors) {
      throw new NotFoundException('No authors found');
    }
    return response.status(HttpStatus.OK).send(authors);
  }

  @Auth(Role.Admin)
  @Get(':id')
  async findOneAuthor(@Res() response, @Param('id') id: string) {
    const author = await this.authorService.getAuthorInfo(id);
    if (!author) {
      throw new NotFoundException('No author found');
    }
    return response.status(HttpStatus.OK).send(author);
  }

  @Auth(Role.Admin)
  @Patch(':id')
  async updateAuthor(
    @Res() response,
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    const updatedAuthor = await this.authorService.updateAuthorInfo(
      id,
      updateAuthorDto,
    );
    if (!updatedAuthor) {
      throw new NotFoundException('No author found');
    }
    return response.status(HttpStatus.OK).send(updatedAuthor);
  }

  @Auth(Role.Admin)
  @Delete(':id')
  async deleteAuthor(@Res() response, @Param('id') id: string) {
    const deletedAuthor = await this.authorService.deleteAuthorInfo(id);
    return response.status(HttpStatus.OK).send(deletedAuthor);
  }
}
