import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useMouseMove } from "@Hook";
import logger from "@Lib/logger";
import { koreaCities } from "@Lib/regions";

import PopupRegionInfo from "@Component/PopupRegionInfo";
import RegionNameSVGText from "./RegionNameSVGText";

import "./style.scss";
import CustomDraggable from "@Component/CustomDraggable";

interface MapSVGProps {
  riverData: RiverLevelSeoulAPIResonse;
  selectedCityName: CityName;
  isInit: boolean;
}

const MapSVG = ({ riverData, selectedCityName, isInit }: MapSVGProps) => {
  const { t } = useTranslation(["article"]);

  const { isMobile, urlParams } = useSelector((reducer: any) => {
    const state: RootState = reducer["main"];
    return { isMobile: state.isMobile, urlParams: state.urlParams };
  });
  const [mouseoveredRegionState, setMouseoveredRegion] = useState<Region | null>(null);
  const [regionsState, setRegions] = useState<Regions>(koreaCities[selectedCityName]);
  const [regionNamesStore, setRegionNames] = useState<string[]>([]);
  const [zoomState, setZoom] = useState<number>(1);
  const [isInitState, setIsInit] = useState<boolean>(isInit);
  const popupRegionInfoRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef();
  const mouseMoveHook = useMouseMove();
  const reduxDispatch = useDispatch();

  // 맵 SVG를 랜더링하기 위한 regions key 값 추출
  useEffect(() => {
    const regionNemes: string[] = [];
    for (const key in regionsState.regions) {
      regionNemes.push(key);
    }
    setRegionNames(regionNemes);
  }, [selectedCityName, regionsState.regions]);

  useEffect(() => {
    setZoom(1);
    if (!isMobile) (svgRef as any).current.setState({ x: 0, y: 0 });
    setRegions(() => {
      const newState = { ...koreaCities[selectedCityName] };

      // 서울 지역 별 하천수위 정보를 seoulRegion애 분류
      for (const key in newState.regions) {
        newState.regions[key].riverLevel = [];
        newState.regions[key].averageRiverLevelRatio = null;
      }
      riverData.ListRiverStageService.row.forEach(itm => {
        newState.regions[itm.GU_NAME].riverLevel.push({
          riverName: itm.RIVER_NAME,
          rivergaugeName: itm.RIVERGAUGE_NAME,
          currentLevel: itm.CURRENT_LEVEL,
          planfloodLevel: itm.PLANFLOOD_LEVEL,
          riverLevelRatio: itm.CURRENT_LEVEL / itm.PLANFLOOD_LEVEL,
        });
      });

      // 분류된 정보로 맵 시각화
      let maxAverageRiverLevelRatio = -99999;
      let maxRegion: Region | null = null;
      for (const key in newState.regions) {
        const region = newState.regions[key];
        if (region.target.current) {
          if (region.riverLevel.length > 0) {
            // 지역별 평균 계획홍수위 대비 현재하천수위 비율
            let averageRiverLevelRatio = 0;
            region.riverLevel.forEach(itm => {
              averageRiverLevelRatio += itm.riverLevelRatio;
            });
            averageRiverLevelRatio /= region.riverLevel.length;
            region.averageRiverLevelRatio = averageRiverLevelRatio;
            if (maxAverageRiverLevelRatio < averageRiverLevelRatio) {
              maxRegion = region;
              maxAverageRiverLevelRatio = averageRiverLevelRatio;
            }

            // 시각화를 위한 비율 매핑
            const mappingedAverageRiverLevelRatio =
              ((averageRiverLevelRatio - 0.3) * (1 - 0)) / (1 - 0.3) + 0;
            logger.debug(key, "평균수위비율", averageRiverLevelRatio);

            // 각 지역에 해당하는 svg path에 스타일 적용
            region.target.current.style.fill = `rgba(60,95,255,${mappingedAverageRiverLevelRatio.toFixed(
              2,
            )})`;
          } else {
            region.target.current.classList.add("no-data");
          }
        }
      }
      reduxDispatch({
        type: "SELECT_REGION",
        selectedRegion: isInitState ? newState.regions[urlParams.sigungu] : maxRegion,
      });

      return newState;
    });
  }, [riverData, selectedCityName, regionNamesStore]);

  // 지역 SVG path mouse enter event handler
  const mouseEnterRegion = (region: Region) => {
    setMouseoveredRegion(region);
  };

  // 지역 SVG path mouse leave event handler
  const mouseLeaveRegion = () => {
    setMouseoveredRegion(null);
  };

  // 지역 SVG path click event handler
  const clickRegion = (region: Region) => {
    setIsInit(false);
    logger.debug("clicked region", region);
    reduxDispatch({ type: "SELECT_REGION", selectedRegion: region });
    window.scrollTo({
      top: document.getElementById("region-detail-graph")?.getBoundingClientRect().top,
      behavior: "smooth",
    });
  };

  return (
    <div className="map">
      {!isMobile && mouseoveredRegionState && mouseoveredRegionState.averageRiverLevelRatio && (
        <PopupRegionInfo
          ref={popupRegionInfoRef}
          region={mouseoveredRegionState}
          mouseX={mouseMoveHook.x}
          mouseY={mouseMoveHook.y}
        />
      )}
      <div className={`svg-area ${isMobile ? "mobile" : ""}`}>
        <CustomDraggable isMobile={isMobile} ref={svgRef}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.2"
            baseProfile="tiny"
            width={`calc(100% * ${zoomState})`}
            height={`calc(100% * ${zoomState})`}
            viewBox={`0 0 ${regionsState.svg.width} ${regionsState.svg.height}`}
            strokeLinecap="round"
            strokeLinejoin="round"
            onMouseMove={mouseMoveHook.handler}
          >
            <g>
              <g>
                {regionNamesStore.map((itm, idx) => {
                  return (
                    <path
                      key={idx}
                      id={`svg-path-${itm}`}
                      ref={regionsState.regions[itm].target}
                      d={regionsState.regions[itm].svgPath}
                      onMouseEnter={() => mouseEnterRegion(regionsState.regions[itm])}
                      onMouseLeave={mouseLeaveRegion}
                      onClick={() => clickRegion(regionsState.regions[itm])}
                    />
                  );
                })}
                <use
                  href={mouseoveredRegionState ? `#svg-path-${mouseoveredRegionState.guName}` : ""}
                />
              </g>
              <g>
                {regionNamesStore.map((itm, idx) => {
                  return (
                    <RegionNameSVGText
                      key={idx}
                      x={regionsState.regions[itm].svgTextPos.x}
                      y={regionsState.regions[itm].svgTextPos.y}
                      regionName={itm}
                      averageRiverLevelRatio={regionsState.regions[itm].averageRiverLevelRatio}
                    ></RegionNameSVGText>
                  );
                })}
              </g>
            </g>
          </svg>
        </CustomDraggable>
      </div>

      <div className="zoom-control">
        <span>{t("article:ARTICLE_ZOOM_OUT")}</span>
        <input
          type="range"
          min={1}
          max={2}
          step={0.0001}
          value={zoomState}
          onChange={event => setZoom(parseFloat(event.target.value))}
        />
        <span>{t("article:ARTICLE_ZOOM_IN")}</span>
        <span className="zoom-magnification">x {zoomState.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default MapSVG;
