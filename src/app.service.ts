import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './app.dto';

@Injectable()
export class AppService {
  private validEmails: string[] = ['tai@gmail.com'];

  getHello(): string {
    return 'Hello World!';
  }

  createPost(post: CreatePostDto) {
    const { email } = post;
    const isValidEmail = this.validEmails.includes(email);

    console.log('App service invoked');

    if (!isValidEmail) throw new BadRequestException();

    return {
      status: 'success',
    };
  }
}
