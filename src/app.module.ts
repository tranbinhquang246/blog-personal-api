import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveStaticOptions: {
        index: false,
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    AuthorModule,
    CategoryModule,
  ],
  providers: [],
})
export class AppModule {}
