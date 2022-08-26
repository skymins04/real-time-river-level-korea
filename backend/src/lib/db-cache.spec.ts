import { PrismaClient } from '@prisma/client';
import DBCache from './db-cache';
import { getDateString } from './util';

describe('DBCache', () => {
  let prisma: PrismaClient;
  let dbCache: DBCache;

  beforeAll(async () => {
    prisma = new PrismaClient();
    dbCache = await DBCache.getInstance();
  });

  afterEach(async () => {
    await prisma.riverlevel_water_level_tb.deleteMany({
      where: { obscd: { startsWith: 'test' } },
    });
    await prisma.riverlevel_gauge_tb.deleteMany({
      where: { obscd: { startsWith: 'test' } },
    });
    await dbCache.initCache();
  });

  it('should be defined', () => {
    expect(DBCache).toBeDefined();
    expect(dbCache).toBeDefined();
  });

  describe('initCache()', () => {
    it('should be defined', () => {
      expect(dbCache.initCache).toBeDefined();
    });

    it('should be initialized cache', async () => {
      await dbCache.initCache();
      expect(dbCache.getRegistedRivergauge()).toBeDefined();
      expect(dbCache.getRegistedRivergaugeCode()).toBeDefined();
      expect(dbCache.getRegistedRiverlevel()).toBeDefined();
    });
  });
  describe('clearCache()', () => {
    it('should be defined', () => {
      expect(dbCache.clearCache).toBeDefined();
    });

    it('should be cleared cache', async () => {
      await prisma.riverlevel_gauge_tb.create({
        data: {
          obscd: 'test_1',
          obsnm: 'test_1',
          mngorg: 'test',
          flood_warning: 'N',
          addr: 'test addr',
          lon: '111-111-111',
          lat: '111-111-111',
          gdt: null,
          planflood_level: null,
        },
      });
      await prisma.riverlevel_water_level_tb.create({
        data: {
          obscd: 'test_1',
          obsdate: getDateString(new Date()),
          water_level: 0,
        },
      });
      await dbCache.initCache();
      await dbCache.clearCache();

      expect(dbCache.getRegistedRivergauge.length).toBe(0);
      expect(dbCache.getRegistedRivergaugeCode.length).toBe(0);
      expect(Object.keys(dbCache.getRegistedRiverlevel).length).toBe(0);
    });
  });

  describe('getInstance()', () => {
    it('should be defined', () => {
      expect(DBCache.getInstance).toBeDefined();
    });
    it('should be return DBCache singleton instance', async () => {
      const testDBCache = await DBCache.getInstance();
      await prisma.riverlevel_gauge_tb.create({
        data: {
          obscd: 'test_1',
          obsnm: 'test_1',
          mngorg: 'test',
          flood_warning: 'N',
          addr: 'test addr',
          lon: '111-111-111',
          lat: '111-111-111',
          gdt: null,
          planflood_level: null,
        },
      });
      await dbCache.initCache();

      expect(testDBCache).toBeInstanceOf(DBCache);
      expect(
        JSON.stringify(dbCache.getRegistedRivergaugeCode()) ===
          JSON.stringify(testDBCache.getRegistedRivergaugeCode()),
      ).toBe(true);
    });
  });
  describe('getRegistedRivergauge()', () => {
    it('should be defined', () => {
      expect(dbCache.getRegistedRivergauge).toBeDefined();
    });

    it('should be return rivergauge object', async () => {
      await prisma.riverlevel_gauge_tb.create({
        data: {
          obscd: 'test_1',
          obsnm: 'test_1',
          mngorg: 'test',
          flood_warning: 'N',
          addr: 'test addr',
          lon: '111-111-111',
          lat: '111-111-111',
          gdt: null,
          planflood_level: null,
        },
      });
      await dbCache.initCache();

      const gauges = dbCache.getRegistedRivergauge();
      expect(gauges.map((x) => x.obscd).includes('test_1')).toBe(true);
    });
  });
  describe('getRegistedRivergaugeCode()', () => {
    it('should be defined', () => {
      expect(dbCache.getRegistedRivergaugeCode).toBeDefined();
    });

    it('should be return rivergauge code array', async () => {
      await prisma.riverlevel_gauge_tb.create({
        data: {
          obscd: 'test_1',
          obsnm: 'test_1',
          mngorg: 'test',
          flood_warning: 'N',
          addr: 'test addr',
          lon: '111-111-111',
          lat: '111-111-111',
          gdt: null,
          planflood_level: null,
        },
      });
      await dbCache.initCache();

      const gaugeCodes = dbCache.getRegistedRivergaugeCode();
      expect(gaugeCodes.includes('test_1')).toBe(true);
    });
  });
  describe('getRegistedRiverlevel()', () => {
    it('should be defined', () => {
      expect(dbCache.getRegistedRiverlevel).toBeDefined();
    });

    it('should be return riverlevel object', async () => {
      const date = getDateString(new Date());
      await prisma.riverlevel_gauge_tb.create({
        data: {
          obscd: 'test_1',
          obsnm: 'test_1',
          mngorg: 'test',
          flood_warning: 'N',
          addr: 'test addr',
          lon: '111-111-111',
          lat: '111-111-111',
          gdt: null,
          planflood_level: null,
        },
      });
      await prisma.riverlevel_water_level_tb.create({
        data: {
          obscd: 'test_1',
          obsdate: date,
          water_level: 0,
        },
      });
      await dbCache.initCache();
      const riverlevels = dbCache.getRegistedRiverlevel();

      expect(Object.keys(riverlevels).includes('test_1')).toBe(true);
      expect(riverlevels['test_1'].includes(date)).toBe(true);
    });
  });
});
