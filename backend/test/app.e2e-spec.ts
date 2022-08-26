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

  beforeEach(async () => {
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
    await prismaService.riverlevel_gauge_tb.deleteMany({
      where: { obscd: { startsWith: 'e2etest' } },
    });
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
    describe('/crawling/riverlevel (POST)', () => {
      it('should be return 400 error', async () => {
        const accessToken = (
          await request(appServer).post('/auth/signin').send({
            api_key: crawlingApiTestKey,
            api_secret: crawlingApiTestSecret,
          })
        ).body.access_token;
        await request(appServer)
          .post('/crawling/riverlevel')
          .set('Authorization', `bearer ${accessToken}`)
          .expect(400);
        await request(appServer)
          .post('/crawling/riverlevel')
          .set('Authorization', `bearer ${accessToken}`)
          .send({
            data: [
              {
                obscd: 'e2etest_1',
              },
            ],
          })
          .expect(400);
      });
      it('should be return 401 error', async () => {
        await request(appServer).post('/crawling/riverlevel').expect(401);
        await request(appServer)
          .post('/crawling/riverlevel')
          .set('Authorization', `bearer aweofihoaiwehfiowhefihawoefh`)
          .expect(401);
      });
      it('should be return 403 error', async () => {
        const accessToken = (
          await request(appServer).post('/auth/signin').send({
            api_key: riverlevelApiTestKey,
            api_secret: riverlevelApiTestSecret,
          })
        ).body.access_token;
        await request(appServer)
          .post('/crawling/riverlevel')
          .set('Authorization', `bearer ${accessToken}`)
          .expect(403);
      });
      it('should be return 201', async () => {
        try {
          const accessToken = (
            await request(appServer).post('/auth/signin').send({
              api_key: crawlingApiTestKey,
              api_secret: crawlingApiTestSecret,
            })
          ).body.access_token;
          const res1 = await request(appServer)
            .post('/crawling/rivergauge')
            .set('Authorization', `bearer ${accessToken}`)
            .send({
              data: [
                {
                  obscd: 'e2etest_1_1',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_2_2',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
              ],
            })
            .expect(201);

          expect(res1.body.requested).toBe(2);
          expect(res1.body.processed).toBe(2);

          const res2 = await request(appServer)
            .post('/crawling/riverlevel')
            .set('Authorization', `bearer ${accessToken}`)
            .send({
              data: [
                {
                  obscd: 'e2etest_1_1',
                  obsdate: '2022-08-27T05:34:00Z',
                  water_level: 1,
                },
                {
                  obscd: 'e2etest_2_2',
                  obsdate: '2022-08-27T05:34:00Z',
                  water_level: 1,
                },
              ],
            })
            .expect(201);

          expect(res2.body.requested).toBe(2);
          expect(res2.body.processed).toBe(2);

          const res3 = await request(appServer)
            .post('/crawling/riverlevel')
            .set('Authorization', `bearer ${accessToken}`)
            .send({
              data: [
                {
                  obscd: 'e2etest_1_1',
                  obsdate: '2022-08-27T05:34:00Z',
                  water_level: 1,
                },
                {
                  obscd: 'e2etest_2_2',
                  obsdate: '2022-08-27T05:34:00Z',
                  water_level: 1,
                },
              ],
            })
            .expect(201);

          expect(res3.body.requested).toBe(2);
          expect(res3.body.processed).toBe(0);
        } finally {
          await prismaService.riverlevel_water_level_tb.deleteMany({
            where: { obscd: { startsWith: 'e2etest' } },
          });
          await prismaService.riverlevel_gauge_tb.deleteMany({
            where: { obscd: { startsWith: 'e2etest' } },
          });
        }
      });
    });
    describe('/crawling/rivergauge (POST)', () => {
      it('should be return 400 error', async () => {
        const accessToken = (
          await request(appServer).post('/auth/signin').send({
            api_key: crawlingApiTestKey,
            api_secret: crawlingApiTestSecret,
          })
        ).body.access_token;
        await request(appServer)
          .post('/crawling/rivergauge')
          .set('Authorization', `bearer ${accessToken}`)
          .expect(400);
        await request(appServer)
          .post('/crawling/rivergauge')
          .set('Authorization', `bearer ${accessToken}`)
          .send({
            data: [
              {
                obscd: 'e2etest_1',
                obsnm: 'test1',
              },
            ],
          })
          .expect(400);
      });
      it('should be return 401 error', async () => {
        await request(appServer).post('/crawling/rivergauge').expect(401);
        await request(appServer)
          .post('/crawling/rivergauge')
          .set('Authorization', `bearer aweofihoaiwehfiowhefihawoefh`)
          .expect(401);
      });
      it('should be return 403 error', async () => {
        const accessToken = (
          await request(appServer).post('/auth/signin').send({
            api_key: riverlevelApiTestKey,
            api_secret: riverlevelApiTestSecret,
          })
        ).body.access_token;
        await request(appServer)
          .post('/crawling/rivergauge')
          .set('Authorization', `bearer ${accessToken}`)
          .expect(403);
      });
      it('should be return 201', async () => {
        try {
          const accessToken = (
            await request(appServer).post('/auth/signin').send({
              api_key: crawlingApiTestKey,
              api_secret: crawlingApiTestSecret,
            })
          ).body.access_token;
          const res1 = await request(appServer)
            .post('/crawling/rivergauge')
            .set('Authorization', `bearer ${accessToken}`)
            .send({
              data: [
                {
                  obscd: 'e2etest_1',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_2',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_3',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_3',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_3',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_3',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
              ],
            })
            .expect(201);

          expect(res1.body.requested).toBe(6);
          expect(res1.body.processed).toBe(3);

          const res2 = await request(appServer)
            .post('/crawling/rivergauge')
            .set('Authorization', `bearer ${accessToken}`)
            .send({
              data: [
                {
                  obscd: 'e2etest_1',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_2',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_3',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
              ],
            })
            .expect(201);
          expect(res2.body.requested).toBe(3);
          expect(res2.body.processed).toBe(0);
        } finally {
          await prismaService.riverlevel_gauge_tb.deleteMany({
            where: { obscd: { startsWith: 'e2etest' } },
          });
        }
      });
    });
    describe('/crawling/rivergauge (PATCH)', () => {
      it('should be return 400', async () => {
        const accessToken = (
          await request(appServer).post('/auth/signin').send({
            api_key: crawlingApiTestKey,
            api_secret: crawlingApiTestSecret,
          })
        ).body.access_token;
        await request(appServer)
          .patch('/crawling/rivergauge')
          .set('Authorization', `bearer ${accessToken}`)
          .expect(400);
        await request(appServer)
          .patch('/crawling/rivergauge')
          .set('Authorization', `bearer ${accessToken}`)
          .send({
            data: [],
          })
          .expect(400);
      });
      it('should be return 401', async () => {
        await request(appServer).patch('/crawling/rivergauge').expect(401);
        await request(appServer)
          .patch('/crawling/rivergauge')
          .set('Authorization', 'bearer aweofihoaiwehfiowhefihawoefh')
          .expect(401);
      });
      it('should be return 403', async () => {
        const accessToken = (
          await request(appServer).post('/auth/signin').send({
            api_key: riverlevelApiTestKey,
            api_secret: riverlevelApiTestSecret,
          })
        ).body.access_token;
        await request(appServer)
          .patch('/crawling/rivergauge')
          .set('Authorization', `bearer ${accessToken}`)
          .expect(403);
      });
      it('should be return 200', async () => {
        try {
          const accessToken = (
            await request(appServer).post('/auth/signin').send({
              api_key: crawlingApiTestKey,
              api_secret: crawlingApiTestSecret,
            })
          ).body.access_token;
          await request(appServer)
            .post('/crawling/rivergauge')
            .set('Authorization', `bearer ${accessToken}`)
            .send({
              data: [
                {
                  obscd: 'e2etest_4',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_5',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
                {
                  obscd: 'e2etest_6',
                  obsnm: 'test1',
                  mngorg: 'test',
                  addr: 'test addr',
                  flood_warning: 'N',
                  lon: '12-123-123',
                  lat: '12-123-123',
                  planflood_level: null,
                  gdt: null,
                },
              ],
            })
            .expect(201);
          const res = await request(appServer)
            .patch('/crawling/rivergauge')
            .set('Authorization', `bearer ${accessToken}`)
            .send({
              data: [
                {
                  obscd: 'e2etest_4',
                  addr: 'updated test addr',
                },
                {
                  obscd: 'e2etest_5',
                  addr: 'updated test addr',
                },
                {
                  obscd: 'e2etest_6',
                  addr: 'updated test addr',
                },
                {
                  obscd: 'e2etest_6',
                  addr: 'updated test addr',
                },
                {
                  obscd: 'e2etest_6',
                  addr: 'updated test addr',
                },
              ],
            })
            .expect(200);
          const addrArr = (
            await prismaService.riverlevel_gauge_tb.findMany({
              where: { obscd: { startsWith: 'e2etest' } },
            })
          ).map((x) => x.addr);
          expect(res.body.requested).toBe(5);
          expect(res.body.processed).toBe(3);
          for (const addr of addrArr) {
            expect(addr).toBe('updated test addr');
          }
        } finally {
          await prismaService.riverlevel_gauge_tb.deleteMany({
            where: { obscd: { startsWith: 'e2etest' } },
          });
        }
      });
    });
  });
});
