import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { CreatePostDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request, @Res() res: Response) {
    const { page, limit } = req.query;

    if (!page || !limit) res.status(400).send({ message: 'Bad request' });
    else res.status(200).send({ message: 'success' });
  }

  @Post('/create')
  createPost(@Body() createPostDto: CreatePostDto) {
    const res = this.appService.createPost(createPostDto);

    return res;
  }
}
