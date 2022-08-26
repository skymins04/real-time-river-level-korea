import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';
import {
  CreateCrawlingRivergaugeBodyDTO,
  UpdateCrawlingRivergaugeBodyDTO,
} from './dto/crawling-rivergauge-body.dto';
import { CreateCrawlingRiverlevelBodyDTO } from './dto/crawling-riverlevel-body.dto';

describe('CrawlingService', () => {
  let crawlingService: CrawlingService;
  let prismaService: PrismaService;

  const initTestData = async () => {
    await prismaService.riverlevel_gauge_tb.createMany({
      data: [
        {
          obscd: 'test_1_cd',
          obsnm: 'test_1_name',
          mngorg: 'test_org',
          flood_warning: 'N',
          addr: 'test addr',
          lon: '1-1-1',
          lat: '1-1-1',
          gdt: null,
          planflood_level: null,
        },
        {
          obscd: 'test_2_cd',
          obsnm: 'test_2_name',
          mngorg: 'test_org',
          flood_warning: 'N',
          addr: 'test addr',
          lon: '2-2-2',
          lat: '2-2-2',
          gdt: null,
          planflood_level: null,
        },
        {
          obscd: 'test_3_cd',
          obsnm: 'test_3_name',
          mngorg: 'test_org',
          flood_warning: 'N',
          addr: 'test addr',
          lon: '3-3-3',
          lat: '3-3-3',
          gdt: null,
          planflood_level: null,
        },
        {
          obscd: 'test_4_cd',
          obsnm: 'test_4_name',
          mngorg: 'test_org',
          flood_warning: 'N',
          addr: 'test addr',
          lon: '4-4-4',
          lat: '4-4-4',
          gdt: null,
          planflood_level: null,
        },
      ],
    });
    await prismaService.riverlevel_water_level_tb.createMany({
      data: [
        {
          obscd: 'test_1_cd',
          obsdate: '2022-08-27T04:33:00Z',
          water_level: 1,
        },
        {
          obscd: 'test_2_cd',
          obsdate: '2022-08-27T04:33:00Z',
          water_level: 1,
        },
        {
          obscd: 'test_3_cd',
          obsdate: '2022-08-27T04:33:00Z',
          water_level: 1,
        },
        {
          obscd: 'test_4_cd',
          obsdate: '2022-08-27T04:33:00Z',
          water_level: 1,
        },
      ],
    });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrawlingController],
      providers: [CrawlingService, PrismaService],
    }).compile();

    crawlingService = module.get<CrawlingService>(CrawlingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await crawlingService.deleteManyGauge('test');
  });

  it('should be defined', () => {
    expect(crawlingService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('initGauges()', () => {
    it('should be defined', () => {
      expect(crawlingService.initGauges).toBeDefined();
    });
  });

  describe('getOnRegistedGauges()', () => {
    it('should be defined', () => {
      expect(crawlingService.getOneRegistedGauges).toBeDefined();
    });

    it('should be return "test_1_cd" gauge object', async () => {
      await initTestData();
      await crawlingService.initGauges(true);
      const gauge = crawlingService.getOneRegistedGauges('test_1_cd');
      expect(gauge).toBeDefined();
      expect(typeof gauge).toBe('object');
      expect(gauge.obscd).toBe('test_1_cd');
    });

    it('should be return undefined', async () => {
      await initTestData();
      await crawlingService.initGauges(true);
      const gauge = crawlingService.getOneRegistedGauges('test_5_cd');
      expect(gauge).toBeUndefined();
    });
  });

  describe('deleteOneGauge()', () => {
    it('should be defined', () => {
      expect(crawlingService.deleteOneGauge).toBeDefined();
    });

    it('should be delete one gauge', async () => {
      await initTestData();
      await crawlingService.initGauges(true);
      await crawlingService.deleteOneGauge('test_1_cd');
      expect(crawlingService.getOneRegistedGauges('test_1_cd')).toBeUndefined();
    });

    it('should not be delete one gauge', async () => {
      await initTestData();
      await crawlingService.initGauges(true);
      await crawlingService.deleteOneGauge('');
      expect(crawlingService.getOneRegistedGauges('test_1_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_2_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_3_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_4_cd')).toBeDefined();
    });
  });

  describe('deleteManyGauge()', () => {
    it('should be defined', () => {
      expect(crawlingService.deleteManyGauge).toBeDefined();
    });

    it('should be delete all gauges that obscd start with "test"', async () => {
      await initTestData();
      await crawlingService.initGauges(true);
      await crawlingService.deleteManyGauge('test');
      expect(
        (
          await prismaService.riverlevel_gauge_tb.findMany({
            where: { obscd: { startsWith: 'test' } },
          })
        ).length,
      ).toBe(0);
      expect(
        (
          await prismaService.riverlevel_water_level_tb.findMany({
            where: { obscd: { startsWith: 'test' } },
          })
        ).length,
      ).toBe(0);
    });
  });

  describe('deleteOneRiverlevel()', () => {
    it('should be defined', () => {
      expect(crawlingService.deleteOneRiverlevel).toBeDefined();
    });

    it('should be delete one riverlevel', async () => {
      await initTestData();
      await crawlingService.initGauges(true);
      await crawlingService.deleteOneRiverlevel(
        'test_1_cd',
        '2022-08-27T04:33:00Z',
      );
      expect(
        (
          await prismaService.riverlevel_water_level_tb.findMany({
            where: {
              obscd: 'test_1_cd',
              obsdate: new Date('2022-08-27T04:33:00Z'),
            },
          })
        ).length,
      ).toBe(0);
    });
  });

  describe('deleteManySpecificGaugeRiverlevel()', () => {
    it('should be defined', () => {
      expect(crawlingService.deleteManySpecificGaugeRiverlevel).toBeDefined();
    });

    it('should be delete all riverlevels of gauge that obscd is "test_1_cd"', async () => {
      await initTestData();
      await crawlingService.initGauges(true);
      await crawlingService.deleteManySpecificGaugeRiverlevel('test_1_cd');
      expect(
        (
          await prismaService.riverlevel_water_level_tb.findMany({
            where: {
              obscd: 'test_1_cd',
            },
          })
        ).length,
      ).toBe(0);
    });
  });

  describe('deleteManyRiverlevel()', () => {
    it('should be defined', () => {
      expect(crawlingService.deleteManyRiverlevel).toBeDefined();
    });

    it('should be delete all riverlevels of gauges that obscd start with "test"', async () => {
      await initTestData();
      await crawlingService.initGauges(true);
      await crawlingService.deleteManyRiverlevel('test');
      expect(
        (
          await prismaService.riverlevel_water_level_tb.findMany({
            where: {
              obscd: { startsWith: 'test' },
            },
          })
        ).length,
      ).toBe(0);
    });
  });

  describe('setRivergauge()', () => {
    it('should be defined', () => {
      expect(crawlingService.setRivergauge).toBeDefined();
    });

    it('should be return {status: "Success", requested: 3, processed: 3}', async () => {
      const body: CreateCrawlingRivergaugeBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            obsnm: 'test_1_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '1-1-1',
            lat: '1-1-1',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_2_cd',
            obsnm: 'test_2_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '2-2-2',
            lat: '2-2-2',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_3_cd',
            obsnm: 'test_3_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '3-3-3',
            lat: '3-3-3',
            gdt: null,
            planflood_level: null,
          },
        ],
      };
      const result = await crawlingService.setRivergauge(body);
      expect(result.status).toBe('Success');
      expect(result.requested).toBe(3);
      expect(result.processed).toBe(3);
      expect(crawlingService.getOneRegistedGauges('test_1_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_2_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_3_cd')).toBeDefined();
    });

    it('should be return {status: "Success", requested: 3, processed: 0}', async () => {
      const body: CreateCrawlingRivergaugeBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            obsnm: 'test_1_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '1-1-1',
            lat: '1-1-1',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_2_cd',
            obsnm: 'test_2_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '2-2-2',
            lat: '2-2-2',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_3_cd',
            obsnm: 'test_3_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '3-3-3',
            lat: '3-3-3',
            gdt: null,
            planflood_level: null,
          },
        ],
      };
      await crawlingService.setRivergauge(body);
      const result = await crawlingService.setRivergauge(body);
      expect(result.status).toBe('Success');
      expect(result.requested).toBe(3);
      expect(result.processed).toBe(0);
      expect(crawlingService.getOneRegistedGauges('test_1_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_2_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_3_cd')).toBeDefined();
    });

    it('should be filter duplicate itmes', async () => {
      const body: CreateCrawlingRivergaugeBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            obsnm: 'test_1_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '1-1-1',
            lat: '1-1-1',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_1_cd',
            obsnm: 'test_1_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '1-1-1',
            lat: '1-1-1',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_1_cd',
            obsnm: 'test_1_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '1-1-1',
            lat: '1-1-1',
            gdt: null,
            planflood_level: null,
          },
        ],
      };
      const result = await crawlingService.setRivergauge(body);
      expect(result.status).toBe('Success');
      expect(result.requested).toBe(3);
      expect(result.processed).toBe(1);
      expect(crawlingService.getOneRegistedGauges('test_1_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_1_cd').obsnm).toBe(
        'test_1_name',
      );
    });
  });

  describe('updateRivergauge()', () => {
    it('should be defined', () => {
      expect(crawlingService.updateRivergauge).toBeDefined();
    });

    it('should be return {status: "Success", requested: 3, processed: 3}', async () => {
      const createBody: CreateCrawlingRivergaugeBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            obsnm: 'test_1_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '1-1-1',
            lat: '1-1-1',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_2_cd',
            obsnm: 'test_2_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '2-2-2',
            lat: '2-2-2',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_3_cd',
            obsnm: 'test_3_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '3-3-3',
            lat: '3-3-3',
            gdt: null,
            planflood_level: null,
          },
        ],
      };
      await crawlingService.setRivergauge(createBody);

      expect(crawlingService.getOneRegistedGauges('test_1_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_2_cd')).toBeDefined();
      expect(crawlingService.getOneRegistedGauges('test_3_cd')).toBeDefined();

      const updateBody: UpdateCrawlingRivergaugeBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            addr: 'updated test addr',
          },
          {
            obscd: 'test_2_cd',
            lon: '222-222-222',
            lat: '222-222-222',
          },
          {
            obscd: 'test_3_cd',
            flood_warning: 'Y',
          },
        ],
      };

      const result = await crawlingService.updateRivergauge(updateBody);
      expect(result.status).toBe('Success');
      expect(result.requested).toBe(3);
      expect(result.processed).toBe(3);
      expect(crawlingService.getOneRegistedGauges('test_1_cd').addr).toBe(
        'updated test addr',
      );
      expect(crawlingService.getOneRegistedGauges('test_2_cd').lon).toBe(
        '222-222-222',
      );
      expect(
        crawlingService.getOneRegistedGauges('test_3_cd').flood_warning,
      ).toBe('Y');
    });
  });

  describe('setRiverlevel()', () => {
    it('should be defined', () => {
      expect(crawlingService.setRiverlevel).toBeDefined();
    });

    it('should be return {status: "Success", requested: 3, processed: 3}', async () => {
      const rivergaugeBody: CreateCrawlingRivergaugeBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            obsnm: 'test_1_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '1-1-1',
            lat: '1-1-1',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_2_cd',
            obsnm: 'test_2_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '2-2-2',
            lat: '2-2-2',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_3_cd',
            obsnm: 'test_3_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '3-3-3',
            lat: '3-3-3',
            gdt: null,
            planflood_level: null,
          },
        ],
      };
      const riverlevelBody: CreateCrawlingRiverlevelBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            obsdate: '2022-08-27T02:01:00Z',
            water_level: 1,
          },
          {
            obscd: 'test_2_cd',
            obsdate: '2022-08-27T02:01:00Z',
            water_level: 1,
          },
          {
            obscd: 'test_3_cd',
            obsdate: '2022-08-27T02:01:00Z',
            water_level: 1,
          },
        ],
      };
      await crawlingService.setRivergauge(rivergaugeBody);
      const res = await crawlingService.setRiverlevel(riverlevelBody);

      expect(res.status).toBe('Success');
      expect(res.requested).toBe(3);
      expect(res.processed).toBe(3);
    });

    it('should be return {status: "Success", requested: 3, processed: 0}', async () => {
      const rivergaugeBody: CreateCrawlingRivergaugeBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            obsnm: 'test_1_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '1-1-1',
            lat: '1-1-1',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_2_cd',
            obsnm: 'test_2_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '2-2-2',
            lat: '2-2-2',
            gdt: null,
            planflood_level: null,
          },
          {
            obscd: 'test_3_cd',
            obsnm: 'test_3_name',
            mngorg: 'test_org',
            flood_warning: 'N',
            addr: 'test addr',
            lon: '3-3-3',
            lat: '3-3-3',
            gdt: null,
            planflood_level: null,
          },
        ],
      };
      const riverlevelBody1: CreateCrawlingRiverlevelBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            obsdate: '2022-08-27T02:01:00Z',
            water_level: 1,
          },
          {
            obscd: 'test_2_cd',
            obsdate: '2022-08-27T02:01:00Z',
            water_level: 1,
          },
          {
            obscd: 'test_3_cd',
            obsdate: '2022-08-27T02:01:00Z',
            water_level: 1,
          },
        ],
      };
      const riverlevelBody2: CreateCrawlingRiverlevelBodyDTO = {
        data: [
          {
            obscd: 'test_1_cd',
            obsdate: '2022-08-27T02:01:00Z',
            water_level: 1,
          },
          {
            obscd: 'test_2_cd',
            obsdate: '2022-08-27T02:01:00Z',
            water_level: 1,
          },
          {
            obscd: 'test_4_cd',
            obsdate: '2022-08-27T02:01:00Z',
            water_level: 1,
          },
        ],
      };
      await crawlingService.setRivergauge(rivergaugeBody);
      await crawlingService.setRiverlevel(riverlevelBody1);
      const res1 = await crawlingService.setRiverlevel(riverlevelBody1);
      const res2 = await crawlingService.setRiverlevel(riverlevelBody2);

      expect(res1.status).toBe('Success');
      expect(res1.requested).toBe(3);
      expect(res1.processed).toBe(0);
      expect(res2.status).toBe('Success');
      expect(res2.requested).toBe(3);
      expect(res2.processed).toBe(0);
    });
  });
});
