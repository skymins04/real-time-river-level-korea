import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { json, urlencoded } from 'express';
import { PrismaService } from 'src/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appServer: any;
  let prismaService: PrismaService;
  const riverlevelApiTestKey = process.env['TEST_RIVERLEVEL_API_KEY'];
  const riverlevelApiTestSecret = process.env['TEST_RIVERLEVEL_API_SECRET'];
  const crawlingApiTestKey = process.env['TEST_CRAWLING_API_KEY'];
  const crawlingApiTestSecret = process.env['TEST_CRAWLING_API_SECRET'];
  const authAdminSecretkey = process.env['AUTH_ADMIN_SECRET_KEY'];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.use(json({ limit: '1mb' }));
    app.use(urlencoded({ limit: '1mb', extended: true }));
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
    appServer = app.getHttpServer();
  });

  describe('/auth', () => {
    describe('/auth/register (POST)', () => {
      it('should be return 400 error', async () => {
        await request(appServer).post('/auth/register').expect(400);
        await request(appServer)
          .post('/auth/register')
          .send({ role: 'test', owner: 'test', admin_key: authAdminSecretkey })
          .expect(400);
      });
      it('should be return 401 error', async () => {
        await request(appServer)
          .post('/auth/register')
          .send({
            role: 'riverlevel',
            owner: 'test',
            admin_key: 'test',
          })
          .expect(401);
      });
      it('should be return 201', async () => {
        const res = await request(appServer)
          .post('/auth/register')
          .send({
            role: 'riverlevel',
            owner: 'test',
            admin_key: authAdminSecretkey,
          })
          .expect(201);
        await prismaService.riverlevel_api_key_tb.delete({
          where: { api_key: res.body.api_key },
        });
      });
    });
    describe('/auth/signin (POST)', () => {
      it('should be return 400 error', async () => {
        await request(appServer).post('/auth/signin').expect(400);
        await request(appServer)
          .post('/auth/signin')
          .send({ api_key: '', api_secret: '' })
          .expect(400);
        await request(appServer)
          .post('/auth/signin')
          .send({
            api_key: 'test123-TEST123-TEST123-TEST123',
            api_secret: 'TEST123-TEST123-TEST123-TEST123',
          })
          .expect(400);
      });
      it('should be return 401 error', async () => {
        await request(appServer)
          .post('/auth/signin')
          .send({
            api_key: 'TEST123-TEST123-TEST123-TEST123',
            api_secret: 'TEST123-TEST123-TEST123-TEST123',
          })
          .expect(401);
      });
      it('should be return 201', async () => {
        const res = await request(appServer)
          .post('/auth/signin')
          .send({
            api_key: riverlevelApiTestKey,
            api_secret: riverlevelApiTestSecret,
          })
          .expect(201);
        expect(res.body.access_token).toBeDefined();
        expect(res.body.refresh_token).toBeDefined();
      });
    });
    describe('/auth/refresh (POST)', () => {
      it('should be return 401 error', async () => {
        await request(appServer).post('/auth/refresh').expect(401);
        await request(appServer)
          .post('/auth/refresh')
          .send({ refresh_token: 'aowihfoiawhefiohawef' })
          .expect(401);
      });
      it('should be return 201', async () => {
        const refresh_token = (
          await request(appServer).post('/auth/signin').send({
            api_key: riverlevelApiTestKey,
            api_secret: riverlevelApiTestSecret,
          })
        ).body.refresh_token;

        const res = await request(appServer)
          .post('/auth/refresh')
          .send({ refresh_token })
          .expect(201);
        expect(res.body.access_token).toBeDefined();
        expect(res.body.refresh_token).toBeDefined();
      });
    });
  });

  describe('/riverlevel', () => {
    it.todo('/riverlevel/{sido} (GET)');
    it.todo('/riverlevel/{sido}/{sigungu} (GET)');
  });

  describe('/crawling', () => {
    it.todo('/auth/riverlevel (POST)');
    it.todo('/auth/rivergauge (POST)');
    it.todo('/auth/rivergauge (PATCH)');
  });
});
