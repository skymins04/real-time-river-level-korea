import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface Props {
  type: "seoul";
  riverData: RiverLevelSeoulAPIResonse | null;
}

const MapSVG: React.FC<Props> = ({ type, riverData }) => {
  const { t } = useTranslation(["region"]);

  const regions: Regions = {
    강동구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    송파구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    강남구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    서초구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    관악구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    동작구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    영등포구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    금천구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    구로구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    강서구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    양천구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    마포구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    서대문구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    은평구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    노원구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    도봉구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    강북구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    성북구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    중량구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    동대문구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    광진구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    성동구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    용산구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    중구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
    종로구: { target: useRef<SVGPathElement>(null), riverLevel: [] },
  };

  useEffect(() => {
    if (riverData) {
      riverData.ListRiverStageService.row.forEach(itm => {
        regions[itm.GU_NAME].riverLevel.push({
          currentLevel: itm.CURRENT_LEVEL,
          planfloodLevel: itm.PLANFLOOD_LEVEL,
          riverLevelRatio: itm.CURRENT_LEVEL / itm.PLANFLOOD_LEVEL,
        });
      });
      console.log("map", regions);
      for (const key in regions) {
        if (regions[key].riverLevel.length > 0) {
          let averageRiverLevelRatio = 0;
          regions[key].riverLevel.forEach(itm => {
            averageRiverLevelRatio += itm.riverLevelRatio;
          });
          averageRiverLevelRatio /= regions[key].riverLevel.length;
          const mappingedAverageRiverLevelRatio =
            ((averageRiverLevelRatio - 0.3) * (1 - 0)) / (1 - 0.3) + 0;
          console.log(key, "평균수위비율", averageRiverLevelRatio);
          regions[
            key
          ].target.current.style.fill = `rgba(110, 122, 255,${mappingedAverageRiverLevelRatio.toFixed(
            2,
          )})`;
        } else {
          regions[key].target.current.classList.add("no-data");
        }
      }
    }
  }, [riverData]);

  return (
    <div className="map">
      {riverData === null && (
        <img style={{ display: "block", margin: "auto" }} src="loading-spin.gif" alt="" />
      )}
      {riverData && type === "seoul" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.2"
          baseProfile="tiny"
          width="800"
          height="529"
          viewBox="0 0 800 529"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g id="seoul_municipalities_geo">
            <path
              className="강동구"
              ref={regions["강동구"].target}
              d="M 665.86 273.17 705.97 257.43 743.06 247.27 765.65 236.01 783.54 235.91 799 271.97 793.44 299.67 762.75 302.75 744.15 324.07 726.75 357.05 677.46 335.53 685.43 315.31 658.97 305.74 665.86 273.17 Z"
            />
            <path
              className="송파구"
              ref={regions["송파구"].target}
              d="M 576.57 341.31 610.16 342.6 638.07 336.43 658.97 305.74 685.43 315.31 677.46 335.53 726.75 357.05 717.81 373.19 727.96 383.05 759.25 389.33 750.43 411.24 730.38 435.05 703.67 451.89 683.62 457.17 658.01 412.04 634.2 397.89 590.95 387.13 582.13 380.06 576.57 341.31 Z"
            />
            <path
              className="강남구"
              ref={regions["강남구"].target}
              d="M 556.52 333.54 576.57 341.31 582.13 380.06 590.95 387.13 634.2 397.89 658.01 412.04 683.62 457.17 674.32 463.05 633.36 464.44 610.16 437.24 568 442.33 551.2 450.3 527.04 417.72 513.02 419.71 470.01 336.03 487.53 321.88 504.81 314.71 556.52 333.54 Z"
            />
            <path
              className="서초구"
              ref={regions["서초구"].target}
              d="M 470.01 336.03 513.02 419.71 527.04 417.72 551.2 450.3 568 442.33 610.16 437.24 633.36 464.44 618.02 494.73 591.68 501.2 584.91 523.42 547.94 528 515.56 503.59 518.1 473.71 497.56 470.12 468.44 476.1 453.7 453.18 425.07 470.82 411.42 434.95 414.08 396.9 408.64 366.41 426.52 365.22 454.31 351.77 470.01 336.03 Z"
            />
            <path
              className="관악구"
              ref={regions["관악구"].target}
              d="M 411.42 434.95 425.07 470.82 375.78 503.79 329.99 513.65 309.33 486.16 282.02 471.61 269.58 442.82 252.66 427.88 259.91 418.91 344.85 401.38 357.9 407.26 390.03 437.44 411.42 434.95 Z"
            />
            <path
              className="동작구"
              ref={regions["동작구"].target}
              d="M 408.64 366.41 414.08 396.9 411.42 434.95 390.03 437.44 357.9 407.26 344.85 401.38 259.91 418.91 277.91 396.8 291.81 394.31 304.01 358.74 351.13 351.07 378.68 365.12 408.64 366.41 Z"
            />
            <path
              className="영등포구"
              ref={regions["영등포구"].target}
              d="M 233.82 292.79 265.71 308.63 320.8 319.79 337.96 332.94 351.13 351.07 304.01 358.74 291.81 394.31 277.91 396.8 259.91 418.91 246.98 411.04 241.79 375.38 214 357.45 215.93 341.01 234.42 331.05 226.93 305.54 233.82 292.79 Z"
            />
            <path
              className="금천구"
              ref={regions["금천구"].target}
              d="M 252.66 427.88 269.58 442.82 282.02 471.61 309.33 486.16 270.54 517.84 259.07 517.24 231.76 462.45 214.85 442.52 204.82 418.12 232.61 429.27 252.66 427.88 Z"
            />
            <path
              className="구로구"
              ref={regions["구로구"].target}
              d="M 108.17 373.79 130.76 385.04 162.53 369.4 182.47 379.66 199.99 379.36 214 357.45 241.79 375.38 246.98 411.04 259.91 418.91 252.66 427.88 232.61 429.27 204.82 418.12 191.29 401.88 160.6 425.39 136.56 436.85 102.97 436.75 88.11 402.87 108.17 373.79 Z"
            />
            <path
              className="강서구"
              ref={regions["강서구"].target}
              d="M 171.96 245.47 188.51 262.41 233.82 292.79 226.93 305.54 184.64 290.5 184.04 332.24 138.61 338.52 124.35 308.93 103.09 311.12 44.37 305.05 4.5 295.68 1 279.34 15.26 269.98 27.22 247.27 47.39 240.29 61.77 217.68 54.52 199.35 70.95 189.29 99.83 214.19 158.79 243.58 171.96 245.47 Z"
            />
            <path
              className="양천구"
              ref={regions["양천구"].target}
              d="M 103.09 311.12 124.35 308.93 138.61 338.52 184.04 332.24 184.64 290.5 226.93 305.54 234.42 331.05 215.93 341.01 214 357.45 199.99 379.36 182.47 379.66 162.53 369.4 130.76 385.04 108.17 373.79 105.14 358.54 115.29 338.22 103.09 311.12 Z"
            />
            <path
              className="마포구"
              ref={regions["마포구"].target}
              d="M 259.67 241.09 262.93 247.86 308.36 267.29 325.03 283.23 372.63 276.06 374.33 290.2 364.3 309.03 340.86 322.28 337.96 332.94 320.8 319.79 265.71 308.63 233.82 292.79 188.51 262.41 171.96 245.47 206.99 235.91 219.32 213.99 259.67 241.09 Z"
            />
            <path
              className="서대문구"
              ref={regions["서대문구"].target}
              d="M 351.13 181.22 366.59 215.78 357.29 237.3 382.54 262.31 372.63 276.06 325.03 283.23 308.36 267.29 262.93 247.86 259.67 241.09 277.91 223.46 296.88 227.34 309.69 210.41 332.4 199.05 351.13 181.22 Z"
            />
            <path
              className="은평구"
              ref={regions["은평구"].target}
              d="M 392.57 134 354.63 148.44 351.13 181.22 332.4 199.05 309.69 210.41 296.88 227.34 277.91 223.46 259.67 241.09 219.32 213.99 247.83 218.47 257.25 206.02 255.44 171.75 267.77 154.12 277.79 110.78 325.27 96.04 345.21 82.49 358.86 89.56 392.57 134 Z"
            />
            <path
              className="노원구"
              ref={regions["노원구"].target}
              d="M 651.6 156.11 633.12 163.38 613.18 157.31 585.15 166.27 567.03 168.66 543.83 149.24 527.28 135.99 544.07 109.79 555.19 107.5 541.54 62.87 545.28 28.2 573.07 22.72 605.21 10.07 630.7 24.01 624.66 43.34 632.63 60.67 625.63 99.92 656.07 110.09 661.75 137.28 651.6 156.11 Z"
            />
            <path
              className="도봉구"
              ref={regions["도봉구"].target}
              d="M 545.28 28.2 541.54 62.87 555.19 107.5 544.07 109.79 527.28 135.99 510.25 115.96 471.34 95.44 482.94 61.17 463.13 32.68 464.34 13.25 477.87 1 501.43 2 509.76 18.93 541.78 14.75 545.28 28.2 Z"
            />
            <path
              className="강북구"
              ref={regions["강북구"].target}
              d="M 463.13 32.68 482.94 61.17 471.34 95.44 510.25 115.96 527.28 135.99 543.83 149.24 518.34 172.25 490.07 174.64 467.84 164.68 462.28 150.23 447.06 146.65 417.34 125.73 418.06 107.5 407.67 90.26 433.29 70.74 433.53 46.33 443.07 34.37 463.13 32.68 Z"
            />
            <path
              className="성북구"
              ref={regions["성북구"].target}
              d="M 398.85 135.79 417.34 125.73 447.06 146.65 462.28 150.23 467.84 164.68 490.07 174.64 518.34 172.25 543.83 149.24 567.03 168.66 585.15 166.27 585.76 183.31 525.59 205.72 491.88 238.9 464.21 234.21 448.87 211.2 430.39 213.19 421.32 168.07 398.85 135.79 Z"
            />
            <path
              className="중량구"
              ref={regions["중량구"].target}
              d="M 585.15 166.27 613.18 157.31 633.12 163.38 651.6 156.11 673.47 162.09 675.4 187.59 658.61 226.15 643.27 227.74 642.3 247.56 623.45 255.33 599.05 250.85 596.03 232.52 581.41 203.83 585.76 183.31 585.15 166.27 Z"
            />
            <path
              className="동대문구"
              ref={regions["동대문구"].target}
              d="M 491.88 238.9 525.59 205.72 585.76 183.31 581.41 203.83 596.03 232.52 599.05 250.85 586.6 273.76 559.66 268.58 539.85 253.74 520.52 248.86 492.24 251.15 491.88 238.9 Z"
            />
            <path
              className="광진구"
              ref={regions["광진구"].target}
              d="M 599.05 250.85 623.45 255.33 642.3 247.56 642.78 273.76 665.86 273.17 658.97 305.74 638.07 336.43 610.16 342.6 576.57 341.31 556.52 333.54 586.6 273.76 599.05 250.85 Z"
            />
            <path
              className="성동구"
              ref={regions["성동구"].target}
              d="M 492.24 251.15 520.52 248.86 539.85 253.74 559.66 268.58 586.6 273.76 556.52 333.54 504.81 314.71 487.53 321.88 463.73 304.75 491.28 277.95 492.24 251.15 Z"
            />
            <path
              className="용산구"
              ref={regions["용산구"].target}
              d="M 463.73 304.75 487.53 321.88 470.01 336.03 454.31 351.77 426.52 365.22 408.64 366.41 378.68 365.12 351.13 351.07 337.96 332.94 340.86 322.28 364.3 309.03 374.33 290.2 380.85 285.22 418.91 285.92 438 298.47 463.73 304.75 Z"
            />
            <path
              className="중구"
              ref={regions["중구"].target}
              d="M 492.24 251.15 491.28 277.95 463.73 304.75 438 298.47 418.91 285.92 380.85 285.22 374.33 290.2 372.63 276.06 382.54 262.31 404.17 255.93 425.67 258.12 492.24 251.15 Z"
            />
            <path
              className="종로구"
              ref={regions["종로구"].target}
              d="M 392.57 134 398.85 135.79 421.32 168.07 430.39 213.19 448.87 211.2 464.21 234.21 491.88 238.9 492.24 251.15 425.67 258.12 404.17 255.93 382.54 262.31 357.29 237.3 366.59 215.78 351.13 181.22 354.63 148.44 392.57 134 Z"
            />
            <text x="720" y="300">
              {t("region:SEOUL_GANGDONG_GU")}
            </text>
            <text x="670" y="385">
              {t("region:SEOUL_SONGPA_GU")}
            </text>
            <text x="550" y="400">
              {t("region:SEOUL_GANGNAM_GU")}
            </text>
            <text x="500" y="450">
              {t("region:SEOUL_SEOCHO_GU")}
            </text>
            <text x="340" y="460">
              {t("region:SEOUL_GWANAK_GU")}
            </text>
            <text x="350" y="390">
              {t("region:SEOUL_DONGJAK_GU")}
            </text>
            <text x="275" y="350">
              {t("region:SEOUL_YEONGDENGPO_GU")}
            </text>
            <text x="256" y="475">
              {t("region:SEOUL_GEUMCHEON_GU")}
            </text>
            <text x="140" y="410">
              {t("region:SEOUL_GURO_GU")}
            </text>
            <text x="120" y="280">
              {t("region:SEOUL_GANGSEO_GU")}
            </text>
            <text x="165" y="360">
              {t("region:SEOUL_YANGSEO_GU")}
            </text>
            <text x="275" y="290">
              {t("region:SEOUL_MAPO_GU")}
            </text>
            <text x="320" y="250">
              {t("region:SEOUL_SEODAEMUN_GU")}
            </text>
            <text x="310" y="170">
              {t("region:SEOUL_EUNPYEONG_GU")}
            </text>
            <text x="587" y="100">
              {t("region:SEOUL_NOWON_GU")}
            </text>
            <text x="511" y="80">
              {t("region:SEOUL_DOBONG_GU")}
            </text>
            <text x="470" y="130">
              {t("region:SEOUL_GANGBUK_GU")}
            </text>
            <text x="480" y="204">
              {t("region:SEOUL_SEONGBUK_GU")}
            </text>
            <text x="623" y="210">
              {t("region:SEOUL_JUNGNANG_GU")}
            </text>
            <text x="550" y="237">
              {t("region:SEOUL_DONGDAEMUN_GU")}
            </text>
            <text x="615" y="305">
              {t("region:SEOUL_GWANGJIN_GU")}
            </text>
            <text x="527" y="295">
              {t("region:SEOUL_SEONGDONG_GU")}
            </text>
            <text x="407" y="333">
              {t("region:SEOUL_YONGSAN_GU")}
            </text>
            <text x="440" y="280">
              {t("region:SEOUL_JUNG_GU")}
            </text>
            <text x="397" y="220">
              {t("region:SEOUL_JONGNO_GU")}
            </text>
          </g>
        </svg>
      )}
    </div>
  );
};

export default MapSVG;
