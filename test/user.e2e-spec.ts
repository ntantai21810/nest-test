import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';

describe('UserController e2e test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.init();
  });

  it('app should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should create user successfully', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({
        email: 'tai@gmail.com',
        password: '123',
      })
      .expect(201);
  });

  it("should return 400 when email isn't valid", () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({
        email: 'tai',
        password: '123',
      })
      .expect(400);
  });

  it("should return 400 when password isn't provided", () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ email: 'tai@gmail.com' })
      .expect(400);
  });
});
