import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateCrawlingRivergaugeBodyDTO,
  UpdateCrawlingRivergaugeBodyDTO,
} from './dto/crawling-rivergauge-body.dto';
import { CreateCrawlingRiverlevelBodyDTO } from './dto/crawling-riverlevel-body.dto';
import { Prisma, riverlevel_gauge_tb } from '@prisma/client';

@Injectable()
export class CrawlingService {
  constructor(private readonly prismaService: PrismaService) {}

  private registedGaugeCodes: string[];
  private registedGauges: riverlevel_gauge_tb[];

  async getRegistedGauges() {
    const gauges = await this.prismaService.riverlevel_gauge_tb.findMany();
    const gaugeCodes = gauges.map((obs) => obs.obscd);
    return { gauges, gaugeCodes };
  }

  getOneRegistedGauges(obscd) {
    return this.registedGauges.filter((obs) => obs.obscd === obscd)[0];
  }

  async initGauges() {
    if (!this.registedGauges || this.registedGauges.length === 0) {
      const { gauges, gaugeCodes } = await this.getRegistedGauges();
      this.registedGauges = gauges;
      this.registedGaugeCodes = gaugeCodes;
    }
  }

  clearGauges() {
    this.registedGauges = [];
    this.registedGaugeCodes = [];
  }

  async setRiverlevel(body: CreateCrawlingRiverlevelBodyDTO) {
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
