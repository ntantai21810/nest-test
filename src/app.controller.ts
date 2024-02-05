import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './app.dto';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Get()
  getHello() {
    return '123';
  }

  @Post('/create')
  createPost(@Body() createPostDto: CreatePostDto) {
    const res = this.appService.createPost(createPostDto);

    return res;
  }
}
