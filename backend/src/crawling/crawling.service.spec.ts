import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';
import {
  CreateCrawlingRivergaugeBodyDTO,
  UpdateCrawlingRivergaugeBodyDTO,
} from './dto/crawling-rivergauge-body.dto';

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
    await prismaService.riverlevel_gauge_tb.deleteMany({});
    crawlingService.clearGauges();
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

  describe('clearGauges()', () => {
    it('shoud be defined', () => {
      expect(crawlingService.clearGauges).toBeDefined();
    });
  });

  describe('getRegistedGaguges()', () => {
    it('should be defined', () => {
      expect(crawlingService.getRegistedGauges).toBeDefined();
    });

    it('should be return registed gauges', async () => {
      await initTestData();
      const { gauges, gaugeCodes } = await crawlingService.getRegistedGauges();
      expect(gauges).toBeDefined();
      expect(gauges.length).toBe(4);
      expect(gauges[0].obscd).toBe('test_1_cd');
      expect(gaugeCodes).toBeDefined();
      expect(gaugeCodes.length).toBe(4);
      expect(gaugeCodes[0]).toBe('test_1_cd');
    });
  });

  describe('getOnRegistedGauges()', () => {
    it('should be defined', () => {
      expect(crawlingService.getOneRegistedGauges).toBeDefined();
    });

    it('should be return "test_1_cd" gauge object', async () => {
      await initTestData();
      await crawlingService.initGauges();
      const gauge = crawlingService.getOneRegistedGauges('test_1_cd');
      expect(gauge).toBeDefined();
      expect(typeof gauge).toBe('object');
      expect(gauge.obscd).toBe('test_1_cd');
    });

    it('should be return undefined', async () => {
      await initTestData();
      await crawlingService.initGauges();
      const gauge = crawlingService.getOneRegistedGauges('test_5_cd');
      expect(gauge).toBeUndefined();
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
            obsnm: 'test_2_name',
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
            obsnm: 'test_3_name',
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
});
