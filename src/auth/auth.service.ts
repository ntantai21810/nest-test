import { User } from './../user/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../user/func';
import { Repository } from 'typeorm';
import { AuthDto } from './auth.dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new BadRequestException();

    const hashedPassword = hashPassword(dto.password);

    if (hashedPassword !== user.password) throw new UnauthorizedException();

    const payload = {
      email: user.email,
      sub: user.id,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      ...user,
      accessToken: token,
    };
  }
}
