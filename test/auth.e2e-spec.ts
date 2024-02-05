import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('AuthController e2e test', () => {
  let app: INestApplication;
  let token = '';

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.init();
  });

  beforeAll(async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'tai@gmail.com',
      password: '123',
    });

    token = res.body.accessToken;
  });

  it('should login successfully', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'tai@gmail.com',
        password: '123',
      })
      .expect(201);
  });

  it('should return 401 when visit /user without token', () => {
    return request(app.getHttpServer()).get('/user').expect(401);
  });

  it('should return 200 when visit /user with token', async () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
