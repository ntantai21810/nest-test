import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as passwordUtils from './func';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === getRepositoryToken(User))
          return {
            save: jest.fn((x) => x),
          };
      })
      .compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  jest.spyOn(passwordUtils, 'hashPassword').mockReturnValue('hashedPassword');

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('should call hashPassword', async () => {
    service.create({
      email: 'tai@gmail.com',
      password: '123',
    });

    expect(passwordUtils.hashPassword).toHaveBeenCalledWith('123');
  });

  it('should call create user with correct params', () => {
    service.create({
      email: 'tai@gmail.com',
      password: '123',
    });

    expect(userRepository.save).toHaveBeenCalledWith({
      email: 'tai@gmail.com',
      password: 'hashedPassword',
    });
  });
});
