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
import { koreaCities } from "@Lib/regions";

const MainPage = () => {
  const { t } = useTranslation(["article", "region"]);

  const { selectedCity, selectedRegion, riverLevelData } = useSelector((reducer: any) => {
    const state: RootState = reducer["main"];
    return {
      selectedCity: state.selectedCity,
      selectedRegion: state.selectedRegion,
      riverLevelData: state.riverLevelData,
    };
  });
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
  const getSortedSelectedCityRegionsKey = () =>
    Object.keys(koreaCities[selectedCityState].regions).sort(
      (a, b) =>
        (koreaCities[selectedCityState].regions[b].averageRiverLevelRatio || 0) -
        (koreaCities[selectedCityState].regions[a].averageRiverLevelRatio || 0),
    );
  const [cityDetailGraphDataState, setCityDetailGraphData] = useState<
    | {
        [key: string]: number | string;
      }[]
    | null
  >(null);
  const [cityDetailGraphDataKeyState, setCityDetailGraphDataKey] = useState<string[]>([]);

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
      const regionDetailGraphData: any[] = [];
      selectedRegionState.riverLevel.forEach(itm => {
        const data: any = {};
        data["group"] = `[${t(`region:REGION_RIVER_${itm.riverName}`)}] ${t(
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

  useEffect(() => {
    const cityDetailGraphData: any[] = [];
    for (const key of getSortedSelectedCityRegionsKey()) {
      const avgRiverLevelRatio = koreaCities[selectedCity].regions[key].averageRiverLevelRatio;
      if (avgRiverLevelRatio) {
        const data: any = {};
        data["group"] =
          t(`region:REGION_${key}`).length < 5
            ? t(`region:REGION_${key}`) + "ㅤㅤ"
            : t(`region:REGION_${key}`);
        data[t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TEXT_3")] = parseFloat(
          (avgRiverLevelRatio * 100).toFixed(2),
        );
        cityDetailGraphData.push(data);
      }
    }
    setCityDetailGraphDataKey([t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TEXT_3")]);
    setCityDetailGraphData(cityDetailGraphData);
  }, [koreaCities[selectedCity], riverLevelDataState, selectedCityState, i18n.language]);

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
                margin: "10px 0",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                {t(`region:REGION_${selectedRegionState.guName}`)}{" "}
                {t("article:ARTICLE_REGION_DETAIL_GRAPH_TITLE")}
              </div>
              <ChartBar
                maxValue={100}
                keys={regionDetailGraphDataKeyState}
                data={regionDetailGraphDataState}
                colors={{
                  "현재하천수위(m)": "rgb(156,173,255)",
                  "계획홍수위(m)": "rgb(107,134,255)",
                  "하천수위비율(%)": "rgb(250,172,150)",
                  "current river level(m)": "rgb(156,173,255)",
                  "planflood level(m)": "rgb(107,134,255)",
                  "river level ratio(%)": "rgb(250,172,150)",
                }}
                axisBottomLegend={regionDetailGraphAxisBottomLegendState}
              />
            </div>
          ) : !selectedRegionState?.averageRiverLevelRatio ? (
            <div
              style={{
                height: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              하천 수위 상세정보 없음
            </div>
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
          {cityDetailGraphDataState ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "250px",
                width: "100%",
                paddingBottom: "10px",
                margin: "10px 0",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                {t(`region:REGION_CITY_${selectedCityState.toUpperCase()}`)}{" "}
                {t("article:ARTICLE_CITY_DETAIL_GRAPH_TITLE")}
              </div>
              <ChartBar
                maxValue={100}
                keys={cityDetailGraphDataKeyState}
                data={cityDetailGraphDataState}
                colors={"rgb(128,150,255)"}
                direction={"horizontal"}
              />
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </WidgetBlock>
      </div>
    </>
  );
};

export default MainPage;
