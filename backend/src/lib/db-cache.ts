import { PrismaClient, riverlevel_gauge_tb } from '@prisma/client';
import { getDateString } from './util';

export default class DBCache {
  private constructor() {
    this._prisma = new PrismaClient();
  }

  private static _instance: DBCache;
  private _prisma: PrismaClient;
  private _registedRivergauge: riverlevel_gauge_tb[];
  private _registedRivergaugeCode: string[];
  private _registedRiverlevel: RiverLevels;

  public static async getInstance() {
    if (!this._instance) {
      this._instance = new DBCache();
      await this._instance.initCache();
    }
    return this._instance;
  }

  private _setRegistedRivergauge(gauges: riverlevel_gauge_tb[]) {
    this._registedRivergauge = gauges;
  }
  public getRegistedRivergauge() {
    return this._registedRivergauge;
  }
  private _setRegistedRivergaugeCode(gaugeCodes: string[]) {
    this._registedRivergaugeCode = gaugeCodes;
  }
  public getRegistedRivergaugeCode() {
    return this._registedRivergaugeCode;
  }
  private _setRegistedRiverlevel(riverlevels: RiverLevels) {
    this._registedRiverlevel = riverlevels;
  }
  public getRegistedRiverlevel() {
    return this._registedRiverlevel;
  }

  private async _getRivergauge() {
    const gaugesCache = await this._prisma.riverlevel_gauge_tb.findMany();
    const gaugeCodesCache = gaugesCache.map((obs) => obs.obscd);
    this._setRegistedRivergauge(gaugesCache);
    this._setRegistedRivergaugeCode(gaugeCodesCache);
  }

  private async _getRiverlevel() {
    const riverlevelsRaw =
      await this._prisma.riverlevel_water_level_tb.findMany();
    const riverlevelCache: RiverLevels = {};
    for (const riverlevel of riverlevelsRaw) {
      if (!riverlevelCache[riverlevel.obscd])
        riverlevelCache[riverlevel.obscd] = [];
      riverlevelCache[riverlevel.obscd].push(getDateString(riverlevel.obsdate));
    }
    this._setRegistedRiverlevel(riverlevelCache);
  }

  public async initCache() {
    await this._getRivergauge();
    await this._getRiverlevel();
  }

  public clearCache() {
    this._setRegistedRivergauge([]);
    this._setRegistedRivergaugeCode([]);
    this._setRegistedRiverlevel({});
  }
}
