import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: '',
          password: '',
          name: '',
        });
      logger.info(response.body.errors);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: 'test',
          name: 'test',
          password: 'test12345',
        });
      logger.info(response.body.errors);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
  });

  it('should be rejected should be username arledy registed', async () => {
    await testService.createUser();
    const response = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        username: 'test',
        name: 'test',
        password: 'test',
      });

    logger.info(response.body.errors);

    expect(response.status).toBe(400);
  });

  it('should be able to login', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users/login')
      .send({
        username: 'shyallllljwoi',
        password: '123456789',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe('shyallllljwoi');
    expect(response.body.data.name).toBe('swshwishwishwish');
    expect(response.body.data.token).toBeDefined();
  });
});
