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

  private registedGaugeCodes: string[] = [];
  private registedGauges: riverlevel_gauge_tb[] = [];
  private registedRiverlevel: RiverLevels = {};
  private dbCache: DBCache;

  /**
   * DB에 등록된 하천수위 관측소들의 관측소 코드들 중 특정 문자열로 시작되는 관측소 코드들을 반환하는 메서드
   * @param obscdStartWidth 하천수위 관측소 코드의 시작 문자열
   * @returns 특정 문자열로 시작되는 관측소 코드들
   */
  private _getGaugeCodesStartWith(obscdStartWidth: string) {
    return this.registedGaugeCodes.filter((x) => {
      return new RegExp(`^${obscdStartWidth}`).test(x);
    });
  }

  /**
   * DB에 등록된 하천수위 관측소등 중 특정 관측소 코드를 가진 하천수위 관측소의 객체를 반환하는 메서드
   * @param obscd 하천수위 관측소 코드
   * @returns 특정 관측소 코드의 하천수위 관측소 객체
   */
  getOneRegistedGauges(obscd) {
    return this.registedGauges.filter((obs) => obs.obscd === obscd)[0];
  }

  /**
   * DB에 등록된 특정 관측소 코드를 가진 하천수위 관측소 하나를 제거하는 메서드
   * 삭제될 하천수위 관측소의 하천수위 관측데이터들도 모두 제거된다.
   * @param obscd 하천수위 관측소 코드
   */
  async deleteOneGauge(obscd: string) {
    if (this.registedGaugeCodes.includes(obscd)) {
      await this.deleteManySpecificGaugeRiverlevel(obscd);
      await this.prismaService.riverlevel_gauge_tb.delete({ where: { obscd } });
      this.registedGaugeCodes = this.registedGaugeCodes.filter(
        (x) => x !== obscd,
      );
      this.registedGauges = this.registedGauges.filter(
        (x) => x.obscd !== obscd,
      );
    }
  }

  /**
   * DB에 등록된 하천수위 관측소들 중 특정 문자열로 시작하는 관측소 코드를 가진 하천수위 관측소들을 모두 제거하는 메서드
   * 삭제될 하천수위 관측소들의 하천수위 관측데이터들도 모두 제거된다.
   * @param obscdStartWith 하천수위 관측소 코드의 시작 문자열
   */
  async deleteManyGauge(obscdStartWith: string) {
    const deleteTargetGaugeCodes = this._getGaugeCodesStartWith(obscdStartWith);
    await this.prismaService.riverlevel_water_level_tb.deleteMany({
      where: { obscd: { in: deleteTargetGaugeCodes } },
    });
    await this.prismaService.riverlevel_gauge_tb.deleteMany({
      where: { obscd: { in: deleteTargetGaugeCodes } },
    });

    this.registedGaugeCodes = this.registedGaugeCodes.filter(
      (x) => !deleteTargetGaugeCodes.includes(x),
    );
    this.registedGauges = this.registedGauges.filter(
      (x) => !deleteTargetGaugeCodes.includes(x.obscd),
    );
    for (const obscd of deleteTargetGaugeCodes) {
      if (this.registedRiverlevel[obscd]) delete this.registedRiverlevel[obscd];
    }
  }

  /**
   * 특정 하천수위 관측 데이터를 제거하는 메서드
   * @param obscd 하천수위 관측소 코드
   * @param obsdate 하천수위 관측 일자
   */
  async deleteOneRiverlevel(obscd: string, obsdate: string) {
    if (
      this.registedRiverlevel[obscd] &&
      this.registedRiverlevel[obscd].includes(obsdate)
    ) {
      await this.prismaService.riverlevel_water_level_tb.deleteMany({
        where: { obscd: obscd, obsdate: new Date(obsdate) },
      });
      this.registedRiverlevel[obscd] = this.registedRiverlevel[obscd].filter(
        (x) => x !== obsdate,
      );
    }
  }

  /**
   * 특정 하천수위 관측소의 모든 하천수위 관측 데이터들을 제거하는 메서드
   * @param obscd 하천수위 관측소 코드
   */
  async deleteManySpecificGaugeRiverlevel(obscd: string) {
    if (
      this.registedRiverlevel[obscd] &&
      this.registedRiverlevel[obscd].length > 0
    ) {
      await this.prismaService.riverlevel_water_level_tb.deleteMany({
        where: {
          obscd,
        },
      });
      delete this.registedRiverlevel[obscd];
    }
  }

  /**
   * 특정 문자열로 시작하는 관측소 코드의 하천수위 관측소의 모든 데이터를 제거하는 메서드
   * @param obscdStartWith 하천수위 관측소의 시작 문자열
   */
  async deleteManyRiverlevel(obscdStartWith: string) {
    const deleteTargetGaugeCodes = this._getGaugeCodesStartWith(obscdStartWith);
    for (const obscd of deleteTargetGaugeCodes) {
      if (this.registedRiverlevel[obscd]) delete this.registedRiverlevel[obscd];
    }
    await this.prismaService.riverlevel_water_level_tb.deleteMany({
      where: { obscd: { in: deleteTargetGaugeCodes } },
    });
  }

  /**
   * DB 캐싱 객체에서 내부 필드로 하천수위 관측소들과 하천수위 관측 데이터를 가져오는 메서드
   * 기본적으로 내부 필드 dhCache가 할당되지 않았을때만 실행됨.
   * force에 true를 대입하면 강제적으로 실행됨.
   * @param force 강제 초기화 실행 플래그
   */
  async initGauges(force = false) {
    if (!this.dbCache || force) {
      this.dbCache = await DBCache.getInstance();
      if (force) await this.dbCache.initCache();
      this.registedGauges = this.dbCache.getRegistedRivergauge();
      this.registedGaugeCodes = this.dbCache.getRegistedRivergaugeCode();
      this.registedRiverlevel = this.dbCache.getRegistedRiverlevel();
    }
  }

  /**
   * [POST] /crawling/riverlevel 엔드포인트의 서비스 메서드
   * @param body post body
   * @returns 요청 결과
   */
  async setRiverlevel(body: CreateCrawlingRiverlevelBodyDTO) {
    await this.initGauges();

    const requestedObsKeys: RiverLevels = {};
    const riverlevelRaw = body.data.filter((obs) => {
      if (
        !this.registedRiverlevel[obs.obscd] ||
        !this.registedRiverlevel[obs.obscd].includes(obs.obsdate)
      )
        if (this.registedGaugeCodes.includes(obs.obscd)) {
          if (!requestedObsKeys[obs.obscd]) requestedObsKeys[obs.obscd] = [];

          if (!requestedObsKeys[obs.obscd].includes(obs.obsdate)) {
            requestedObsKeys[obs.obscd].push(obs.obsdate);
            return true;
          }
        }
      return false;
    });
    const riverlevelArray: riverlevel_water_level_tb[] = riverlevelRaw.map(
      (riverlevel) => ({
        no: undefined,
        obscd: riverlevel.obscd,
        obsdate: new Date(riverlevel.obsdate),
        water_level: riverlevel.water_level,
      }),
    );

    if (riverlevelArray.length !== 0) {
      for (const riverlevel of riverlevelRaw) {
        if (!this.registedRiverlevel[riverlevel.obscd])
          this.registedRiverlevel[riverlevel.obscd] = [];
        this.registedRiverlevel[riverlevel.obscd].push(riverlevel.obsdate);
      }
      await this.prismaService.riverlevel_water_level_tb.createMany({
        data: riverlevelArray,
      });
    }

    return {
      status: 'Success',
      requested: body.data.length,
      processed: riverlevelArray.length,
    };
  }

  /**
   * [POST] /crawling/rivergauge 엔드포인트의 서비스 메서드
   * @param body post body
   * @returns 요청 결과
   */
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

  /**
   * [PATCH] /crawling/rivergauge 엔드포인트의 서비스 메서드
   * @param body post body
   * @returns 요청 결과
   */
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
