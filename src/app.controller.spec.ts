import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BadRequestException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

  const response = {
    send: jest.fn((y) => y),
  };

  const mockRequest = {
    query: {},
  } as unknown as Request;
  const mockResponse = {
    status: jest.fn(() => response),
  } as unknown as Response;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    })
      .useMocker((token) => {
        if (token === AppService) {
          return {
            createPost: jest.fn((x) => {
              if (x.email === 'tai@gmail.com') {
                return { status: 'success' };
              } else throw new BadRequestException();
            }),
          };
        }
      })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return status 400', () => {
      appController.getHello(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      // expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Bad request',
      });
    });

    it('should return status 200', () => {
      mockRequest.query = { page: 1, limit: 10 } as any;

      appController.getHello(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      // expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith({
        message: 'success',
      });
    });
  });

  describe('createPost', () => {
    it('should return status 400', () => {
      const res = appController.createPost({
        email: 'tai@gmail.com',
        price: 10,
      });

      expect(res).toStrictEqual({ status: 'success' });
    });

    it('should throw BadRequestException', () => {
      expect(() =>
        appController.createPost({
          email: 'tai',
          price: 10,
        }),
      ).toThrow(BadRequestException);
    });
  });
});
