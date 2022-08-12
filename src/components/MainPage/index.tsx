import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import WidgetBlock from "@Component/WidgetBlock";
import MapSVG from "@Component/MapSVG";
import { useRiverLevelData } from "@Hook";

import "./style.scss";
import { useSelector } from "react-redux";

const MainPage = () => {
  const { selectedCity, selectedRegion, riverLevelData } = useSelector((state: RootState) => ({
    selectedCity: state.selectedCity,
    selectedRegion: state.selectedRegion,
    riverLevelData: state.riverLevelData,
  }));
  const [riverLevelDataState, setRiverLevelData] = useState<RiverLevelSeoulAPIResonse | null>(null);
  const [selectedCityState, setSelectedCity] = useState<CityName>(selectedCity);
  const [selectedRegionState, setSelectedRegion] = useState<Region | null>(selectedRegion);
  const getRiverLevelData = useRiverLevelData();

  const { t } = useTranslation(["article", "region"]);

  useEffect(() => {
    getRiverLevelData(selectedCityState);
  }, []);

  useEffect(() => {
    setSelectedCity(selectedCity);
    getRiverLevelData(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    setSelectedRegion(selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    setRiverLevelData(riverLevelData);
  }, [riverLevelData]);

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
              <div className="text title font-bolder">ⓘ 용어설명</div>
              <div className="text info">
                <span className="font-bolder">하천수위비율(%)</span> = 현재하천수위(m) ÷
                계획홍수위(m)
              </div>
              <div className="text info">
                <span className="font-bolder">평균하천수위비율(%)</span> = 지역 내 각 하천들의
                하천수위비율 평균
              </div>
            </div>
          </>
        ) : (
          <img style={{ display: "block", margin: "auto" }} src="loading-spin.gif" alt="" />
        )}
      </WidgetBlock>
      <div className="sub-articles">
        <WidgetBlock
          icon={"📊"}
          title={`${
            selectedRegionState ? t(`region:REGION_${selectedRegionState.guName}`) : ""
          } ${t("article:ARTICLE_WIDGET_TITLE_DETAIL_GRAPH")}`}
        >
          <h1>준비중입니다.</h1>
        </WidgetBlock>
        <WidgetBlock
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
