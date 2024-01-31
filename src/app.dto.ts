import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;
}
