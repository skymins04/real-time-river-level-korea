import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateCrawlingRivergaugeBodyDTO,
  UpdateCrawlingRivergaugeBodyDTO,
} from './dto/crawling-rivergauge-body.dto';
import { CreateCrawlingRiverlevelBodyDTO } from './dto/crawling-riverlevel-body.dto';
import {
  Prisma,
  riverlevel_gauge_tb,
  riverlevel_water_level_tb,
} from '@prisma/client';
import DBCache from 'src/lib/db-cache';

@Injectable()
export class CrawlingService {
  constructor(private readonly prismaService: PrismaService) {}

  private registedGaugeCodes: string[];
  private registedGauges: riverlevel_gauge_tb[];
  private registedRiverlevel: RiverLevels;
  private dbCache: DBCache;

  async getRegistedGauges() {
    const gauges = await this.prismaService.riverlevel_gauge_tb.findMany();
    const gaugeCodes = gauges.map((obs) => obs.obscd);
    return { gauges, gaugeCodes };
  }

  getOneRegistedGauges(obscd) {
    return this.registedGauges.filter((obs) => obs.obscd === obscd)[0];
  }

  async initGauges(force = false) {
    if (!this.dbCache || force) {
      this.dbCache = await DBCache.getInstance();
      this.registedGauges = this.dbCache.getRegistedRivergauge();
      this.registedGaugeCodes = this.dbCache.getRegistedRivergaugeCode();
      this.registedRiverlevel = this.dbCache.getRegistedRiverlevel();
    }
  }

  clearGauges() {
    this.dbCache = null;
    this.registedGauges = [];
    this.registedGaugeCodes = [];
    this.registedRiverlevel = {};
  }

  async setRiverlevel(body: CreateCrawlingRiverlevelBodyDTO) {
    await this.initGauges();

    const requestedObsKeys: string[] = [];

    return true;
  }

  async setRivergauge(body: CreateCrawlingRivergaugeBodyDTO) {
    await this.initGauges();

    const requestedObsKeys: string[] = [];
    const obsArray: riverlevel_gauge_tb[] = body.data
      .filter((obs) => {
        if (!requestedObsKeys.includes(obs.obscd)) {
          requestedObsKeys.push(obs.obscd);
          if (!this.registedGaugeCodes.includes(obs.obscd)) return true;
        }
        return false;
      })
      .map((obs) => ({
        no: undefined,
        obscd: obs.obscd,
        obsnm: obs.obsnm,
        mngorg: obs.mngorg,
        flood_warning: obs.flood_warning,
        addr: obs.addr !== null ? obs.addr : null,
        lon: obs.lon !== null ? obs.lon : null,
        lat: obs.lat !== null ? obs.lat : null,
        gdt: obs.gdt !== null ? obs.gdt : null,
        planflood_level:
          obs.planflood_level !== null ? obs.planflood_level : null,
      }));

    if (obsArray.length !== 0) {
      this.registedGauges.push(...obsArray);
      this.registedGaugeCodes.push(...obsArray.map((obs) => obs.obscd));
      await this.prismaService.riverlevel_gauge_tb.createMany({
        data: obsArray,
      });
    }

    return {
      status: 'Success',
      requested: body.data.length,
      processed: obsArray.length,
    };
  }

  async updateRivergauge(body: UpdateCrawlingRivergaugeBodyDTO) {
    await this.initGauges();

    const requestedObsKeys: string[] = [];
    const obsArray: Prisma.riverlevel_gauge_tbUpdateInput[] = body.data
      .filter((obs) => {
        if (!requestedObsKeys.includes(obs.obscd)) {
          requestedObsKeys.push(obs.obscd);
          for (const key in obs) {
            const tmp = this.getOneRegistedGauges(obs.obscd);
            if (tmp) {
              if (obs[key] !== tmp[key]) return true;
            }
          }
        }
        return false;
      })
      .map((obs) => {
        const gauge = this.getOneRegistedGauges(obs.obscd);
        const updateObs = {
          obscd: obs.obscd,
          obsnm: undefined,
          mngorg: undefined,
          flood_warning: undefined,
          addr: undefined,
          lon: undefined,
          lat: undefined,
          gdt: undefined,
          planflood_level: undefined,
        };
        for (const key in gauge) {
          if (obs[key] !== gauge[key] && key !== 'obscd') {
            updateObs[key] = obs[key];
            gauge[key] = obs[key];
          }
        }
        return updateObs;
      });

    for (const obs of obsArray) {
      await this.prismaService.riverlevel_gauge_tb.update({
        where: {
          obscd: obs.obscd.toString(),
        },
        data: obs,
      });
    }

    return {
      status: 'Success',
      requested: body.data.length,
      processed: obsArray.length,
    };
  }
}
