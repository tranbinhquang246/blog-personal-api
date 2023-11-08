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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from '@/auth/decorators/auth.decorators';
import { Role } from '@/auth/roles/roles.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth(Role.Admin)
  @Post()
  async create(@Res() response, @Body() createCategoryDto: CreateCategoryDto) {
    const createdCategory =
      await this.categoryService.createCategory(createCategoryDto);
    return response.status(HttpStatus.OK).send(createdCategory);
  }

  @Auth(Role.Admin)
  @Get()
  async findAll(@Res() response) {
    const categories = await this.categoryService.findAll();
    return response.status(HttpStatus.OK).send(categories);
  }

  @Auth(Role.Admin)
  @Patch(':id')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const updatedCategory = await this.categoryService.updateCategory(
      id,
      updateCategoryDto,
    );
    return response.status(HttpStatus.OK).send(updatedCategory);
  }

  @Auth(Role.Admin)
  @Delete(':id')
  async remove(@Res() response, @Param('id') id: string) {
    const deletedCategory = await this.categoryService.removeCategory(id);
    return response.status(HttpStatus.OK).send(deletedCategory);
  }
}
