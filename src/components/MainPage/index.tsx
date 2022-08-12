import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import WidgetBlock from "@Component/WidgetBlock";
import MapSVG from "@Component/MapSVG";
import LoadingSpinner from "@Component/LoadingSpinner";
import ChartBar from "@Component/ChartBar";
import { useRiverLevelData } from "@Hook";
import i18n from "@i18n";

import "./style.scss";

const MainPage = () => {
  const { t } = useTranslation(["article", "region"]);

  const { selectedCity, selectedRegion, riverLevelData } = useSelector((state: RootState) => ({
    selectedCity: state.selectedCity,
    selectedRegion: state.selectedRegion,
    riverLevelData: state.riverLevelData,
  }));
  const [riverLevelDataState, setRiverLevelData] = useState<RiverLevelSeoulAPIResonse | null>(null);
  const [selectedCityState, setSelectedCity] = useState<CityName>(selectedCity);
  const [selectedRegionState, setSelectedRegion] = useState<Region | null>(selectedRegion);
  const [regionDetailGraphDataState, setRegionDetailGraphData] = useState<
    | {
        [key: string]: number | string;
      }[]
    | null
  >(null);
  const [regionDetailGraphDataKeyState, setRegionDetailGraphDataKey] = useState<string[]>([]);
  const [regionDetailGraphAxisBottomLegendState, setRegionDetailGraphAxisBottomLegendState] =
    useState<string>(t("article:ARTICLE_REGION_DETAIL_GRAPH_AXIS_BOTTOM_LEGEND"));
  const getRiverLevelData = useRiverLevelData();

  useEffect(() => {
    getRiverLevelData(selectedCityState);
  }, []);

  useEffect(() => {
    setSelectedCity(selectedCity);
    getRiverLevelData(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    setRegionDetailGraphData(null);
    setSelectedRegion(selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    setRiverLevelData(riverLevelData);
  }, [riverLevelData]);

  useEffect(() => {
    if (selectedRegionState && selectedRegionState?.averageRiverLevelRatio) {
      const regionDetailGraphData: any = [];
      selectedRegionState.riverLevel.forEach(itm => {
        const data: any = {};
        data["rivergauge"] = `[${t(`region:REGION_RIVER_${itm.riverName}`)}] ${t(
          `region:REGION_RIVERGAUGE_${itm.rivergaugeName}`,
        )}`;
        data[t("article:ARTICLE_REGION_DETAIL_GRAPH_KEY_1")] = itm.currentLevel;
        data[t("article:ARTICLE_REGION_DETAIL_GRAPH_KEY_2")] = itm.planfloodLevel;
        data[t("article:ARTICLE_REGION_DETAIL_GRAPH_KEY_3")] = parseFloat(
          (itm.riverLevelRatio * 100).toFixed(2),
        );
        regionDetailGraphData.push(data);
      });
      setRegionDetailGraphAxisBottomLegendState(
        t("article:ARTICLE_REGION_DETAIL_GRAPH_AXIS_BOTTOM_LEGEND"),
      );
      setRegionDetailGraphDataKey([
        t("article:ARTICLE_REGION_DETAIL_GRAPH_KEY_1"),
        t("article:ARTICLE_REGION_DETAIL_GRAPH_KEY_2"),
        t("article:ARTICLE_REGION_DETAIL_GRAPH_KEY_3"),
      ]);
      setRegionDetailGraphData(regionDetailGraphData);
    }
  }, [selectedRegionState, i18n.language]);

  return (
    <>
      <WidgetBlock
        widgetId="main-graph"
        icon={"🔍"}
        title={`${t("article:ARTICLE_WIDGET_TITLE_MAIN_GRAPH")} (${new Date()})`}
      >
        {riverLevelDataState ? (
          <>
            <MapSVG riverData={riverLevelDataState} selectedCityName={selectedCityState} />
            <div className="info">
              <div className="info-color">
                <div className="info-color-riverlevel">
                  <div className="text min">100%</div>
                  <div className="icon"></div>
                  <div className="text max">30%</div>
                  <div className="text title">
                    {t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_1")} (%)
                  </div>
                </div>
                <div className="info-color-no-data">
                  <div className="icon"></div>
                  <div className="text title">{t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_2")}</div>
                </div>
              </div>
            </div>
            <div className="info-bottom">
              <div className="text title font-bolder">
                ⓘ {t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TITLE")}
              </div>
              <div className="text info">
                *
                <span className="font-bolder">
                  {t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TEXT_1")}
                </span>
                {t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TEXT_2")}
              </div>
              <div className="text info">
                *
                <span className="font-bolder">
                  {t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TEXT_3")}
                </span>
                {t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TEXT_4")}
              </div>
              <div className="text info">
                *
                <span className="font-bolder">
                  {t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TEXT_5")}
                </span>
                {t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TEXT_6")}
              </div>
            </div>
          </>
        ) : (
          <LoadingSpinner />
        )}
      </WidgetBlock>
      <div className="sub-articles">
        <WidgetBlock
          widgetId="region-detail-graph"
          icon={"📊"}
          title={`${
            selectedRegionState ? t(`region:REGION_${selectedRegionState.guName}`) : ""
          } ${t("article:ARTICLE_WIDGET_TITLE_DETAIL_GRAPH")}`}
        >
          {selectedRegionState && regionDetailGraphDataState ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "250px",
                width: "100%",
                paddingBottom: "10px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>관측계 별 하천 수위 그래프</div>
              <ChartBar
                maxValue={100}
                keys={regionDetailGraphDataKeyState}
                data={regionDetailGraphDataState}
                colors={{
                  "현재하천수위(m)": "rgb(128,150,255)",
                  "계획홍수위(m)": "rgb(60, 95, 255)",
                  "하천수위비율(%)": "rgb(255,200,128)",
                  "current river level(m)": "rgb(128,150,255)",
                  "planflood level(m)": "rgb(60, 95, 255)",
                  "river level ratio(%)": "rgb(255,200,128)",
                }}
                axisBottomLegend={regionDetailGraphAxisBottomLegendState}
              />
            </div>
          ) : !selectedRegionState?.averageRiverLevelRatio ? (
            <div>하천 수위 상세정보 없음</div>
          ) : (
            <LoadingSpinner />
          )}
        </WidgetBlock>
        <WidgetBlock
          widgetId="city-detail-graph"
          icon={"🏢"}
          title={`${t(`region:REGION_CITY_${selectedCityState.toUpperCase()}`)} ${t(
            "article:ARTICLE_WIDGET_TITLE_DETAIL_GRAPH",
          )}`}
        >
          <h1>준비중입니다.</h1>
        </WidgetBlock>
      </div>
    </>
  );
};

export default MainPage;
