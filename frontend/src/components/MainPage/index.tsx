/* eslint-disable import/no-unresolved */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import WidgetBlock from "@Component/WidgetBlock";
import MapSVG from "@Component/MapSVG";
import LoadingSpinner from "@Component/LoadingSpinner";
import ChartBar from "@Component/ChartBar";
import ImageViewer from "@Component/ImageViewer";
import { koreaCities } from "@Lib/regions";
import { useRiverLevelData } from "@Hook";
import i18n from "@i18n";

import kroeaRegionNames from "./floodRiskMapWithImageFileName.json";
import kakaotalkIcon from "@Public/kakao-icon.png";
import facebookIcon from "@Public/facebook-icon.png";
import "./style.scss";

const MainPage = () => {
  const getDateTime = () => {
    const d = new Date();
    return `${d.getFullYear()}. ${d.getMonth()}. ${d.getDate()} - ${
      d.getHours() / 12 < 1 ? t("article:ARTICLE_TIME_AM") : t("article:ARTICLE_TIME_PM")
    } ${d.getHours() % 12}:${d.getMinutes()}:${d.getSeconds()}`;
  };

  const getSidoName = (key: CityName) => {
    const sidoName = {
      seoul: "서울특별시",
    };
    return sidoName[key];
  };

  const checkParams = (sido: any, sigungu: any) => {
    if (typeof sido === "string" && typeof sigungu === "string") {
      if (koreaCities[sido]) {
        if (koreaCities[sido].regions[sigungu]) return true;
      }
    }

    return false;
  };

  const { t } = useTranslation(["article", "region"]);

  const { selectedCity, selectedRegion, riverLevelData, urlParams } = useSelector(
    (reducer: any) => {
      const state: RootState = reducer["main"];
      return {
        selectedCity: state.selectedCity,
        selectedRegion: state.selectedRegion,
        riverLevelData: state.riverLevelData,
        urlParams: state.urlParams,
      };
    },
  );
  const checkParamResult = checkParams(urlParams.sido, urlParams.sigungu);
  console.log("test", checkParamResult);
  const [isInitedState] = useState<boolean>(checkParamResult);
  const [riverLevelDataState, setRiverLevelData] = useState<RiverLevelSeoulAPIResonse | null>(null);
  const [selectedCityState, setSelectedCity] = useState<CityName>(
    checkParamResult ? urlParams.sido : selectedCity,
  );
  const [selectedRegionState, setSelectedRegion] = useState<Region | null>(
    checkParamResult ? koreaCities[urlParams.sido].regions[urlParams.sigungu] : selectedRegion,
  );
  console.log(selectedRegionState);
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
  const [floodRiskMapURLsState, setFloodRiskMapURLs] = useState<string[]>([]);
  const [floodRiskMapSidoState, setFloodRiskMapSido] = useState<string>(
    getSidoName(selectedCityState),
  );
  const [floodRiskMapSigunguListState, setFloodRiskMapSigunguList] = useState<string[]>([]);
  const [floodRiskMapSigunguState, setFloodRiskMapSigungu] = useState<string | null>(null);
  const [floodRiskMapYubmyeondongState, setFloodRiskMapYubmyeondong] = useState<string | null>(
    null,
  );
  const [floodRiskMapYubmyeondongListState, setFloodRiskMapYubmyeondongList] = useState<string[]>(
    [],
  );

  const getRiverLevelData = useRiverLevelData();

  const getShareLink = () =>
    `https://river-level.netlify.app?sido=${selectedCityState}&sigungu=${selectedRegionState?.guName}`;
  const kakaoShare = () => {
    const items = [];
    if (selectedRegionState)
      items.push(
        ...selectedRegionState.riverLevel.map(x => ({
          item: x.rivergaugeName,
          itemOp: x.currentLevel.toString() + " m",
        })),
      );
    (window as any).Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${getSidoName(selectedCityState)} ${
          selectedRegionState?.guName
        } 실시간 하천 수위 현황`,
        description: "하천수위비율(%) = (현재하천수위(m) ÷ 계획홍수위(m)) * 100",
        imageUrl: "",
        link: {
          mobileWebUrl: "",
          androidExecutionParams: "test",
        },
      },
      itemContent: {
        profileText: "실시간 하천 수위 현황",
        titleImageText: `${getSidoName(selectedCity)} ${selectedRegionState?.guName} 하천수위`,
        items: items,
        sum: "평균수위비율",
        sumOp: selectedRegionState?.averageRiverLevelRatio
          ? (selectedRegionState.averageRiverLevelRatio * 100).toFixed(2) + " %"
          : "하천수위정보 없음",
      },
      buttons: [
        {
          title: "자세히보기",
          link: {
            mobileWebUrl: getShareLink(),
          },
        },
      ],
    });
  };

  useEffect(() => {
    getRiverLevelData(selectedCityState);
    if (!(window as any).Kakao.isInitialized()) {
      (window as any).Kakao.init(process.env["REACT_APP_KAKAO_API_KEY"]);
    }
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
    setFloodRiskMapSigunguList(
      Object.keys((kroeaRegionNames as any)[floodRiskMapSidoState]["sigungu"]),
    );
    setFloodRiskMapSigungu(null);
    setFloodRiskMapYubmyeondongList([]);
    setFloodRiskMapYubmyeondong(null);
  }, [floodRiskMapSidoState]);

  useEffect(() => {
    if (floodRiskMapSigunguState)
      setFloodRiskMapYubmyeondongList(
        Object.keys(
          (kroeaRegionNames as any)[floodRiskMapSidoState]["sigungu"][floodRiskMapSigunguState][
            "yubmyundong"
          ],
        ),
      );
    setFloodRiskMapYubmyeondong(null);
  }, [floodRiskMapSigunguState]);

  useEffect(() => {
    if (floodRiskMapSigunguState && floodRiskMapYubmyeondongState)
      setFloodRiskMapURLs(
        (kroeaRegionNames as any)[floodRiskMapSidoState]["sigungu"][floodRiskMapSigunguState][
          "yubmyundong"
        ][floodRiskMapYubmyeondongState]["img"].map(
          (x: string) =>
            `https://cdn.jsdelivr.net/gh/skymins04/real-time-river-level-korea-cdn/${x}`,
        ),
      );
  }, [floodRiskMapYubmyeondongState]);

  useEffect(() => {
    if (selectedRegionState) {
      const tmp = Object.keys(
        (kroeaRegionNames as any)[floodRiskMapSidoState]["sigungu"][selectedRegionState.guName][
          "yubmyundong"
        ],
      );
      setFloodRiskMapSigungu(selectedRegionState.guName);
      setFloodRiskMapYubmyeondongList(tmp);
      for (const arr of tmp) {
        if (
          (kroeaRegionNames as any)[floodRiskMapSidoState]["sigungu"][selectedRegionState.guName][
            "yubmyundong"
          ][arr]["img"].length !== 0
        ) {
          setFloodRiskMapYubmyeondong(arr);
          break;
        }
      }
    }
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
        title={`${t("article:ARTICLE_WIDGET_TITLE_MAIN_GRAPH")}`}
        rightArea={`(${t("article:ARTICLE_LATEST_UPDATED_AT")}: ${getDateTime()})`}
      >
        {riverLevelDataState ? (
          <>
            <MapSVG
              isInit={isInitedState}
              riverData={riverLevelDataState}
              selectedCityName={selectedCityState}
            />
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
              <div className="text info">*{t("article:ARTICLE_MAIN_GRATH_DESCRIPTION_TEXT_7")}</div>
            </div>
          </>
        ) : (
          <LoadingSpinner marginBottom="-100px" />
        )}
      </WidgetBlock>
      <div className="sub-articles">
        <WidgetBlock
          widgetId="region-detail-graph"
          icon={"📌"}
          title={`${
            selectedRegionState ? t(`region:REGION_${selectedRegionState.guName}`) : ""
          } ${t("article:ARTICLE_WIDGET_TITLE_DETAIL_GRAPH")}`}
          flexDirection={"column"}
        >
          {selectedRegionState && regionDetailGraphDataState ? (
            <>
              <ChartBar
                maxValue={100}
                keys={regionDetailGraphDataKeyState}
                data={regionDetailGraphDataState}
                height={"250px"}
                chartTitle={`${t(`region:REGION_${selectedRegionState.guName}`)} ${t(
                  "article:ARTICLE_REGION_DETAIL_GRAPH_TITLE",
                )}`}
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
            </>
          ) : !selectedRegionState?.averageRiverLevelRatio ? (
            <div className="no-graph-data">{t("article:ARTICLE_REGION_DETAIL_GRAPH_NO_DATA")}</div>
          ) : (
            selectedRegionState?.averageRiverLevelRatio && <LoadingSpinner />
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
            <ChartBar
              maxValue={100}
              height={"250px"}
              chartTitle={`${t(`region:REGION_CITY_${selectedCityState.toUpperCase()}`)} ${t(
                "article:ARTICLE_CITY_DETAIL_GRAPH_TITLE",
              )}`}
              keys={cityDetailGraphDataKeyState}
              data={cityDetailGraphDataState}
              colors={"rgb(128,150,255)"}
              direction={"horizontal"}
            />
          ) : (
            <LoadingSpinner />
          )}
        </WidgetBlock>
      </div>
      <WidgetBlock
        widgetId={"flood-risk-map-widget"}
        icon={"🗺"}
        title={t("article:ARITLCE_FLOOD_RISK_MAP_WIDGET_TITLE")}
        rightArea={
          <a
            href="https://tamsak.kbs.co.kr/floodriskmap/index.html"
            target="_blank"
            rel="noreferrer"
          >
            {t("article:ARITLCE_FLOOD_RISK_MAP_WIDGET_TITLE_RIGHT_AREA")}
          </a>
        }
      >
        <div className="map-selector input-group">
          <select
            className="select"
            defaultValue={floodRiskMapSidoState}
            onChange={event => setFloodRiskMapSido(event.target.value)}
          >
            <option>시 도 선택</option>
            <option value="서울특별시">서울특별시</option>
            <option value="부산광역시">부산광역시</option>
            <option value="대구광역시">대구광역시</option>
            <option value="인천광역시">인천광역시</option>
            <option value="광주광역시">광주광역시</option>
            <option value="대전광역시">대전광역시</option>
            <option value="울산광역시">울산광역시</option>
            <option value="세종특별자치시">세종특별자치시</option>
            <option value="경기도">경기도</option>
            <option value="강원도">강원도</option>
            <option value="충청북도">충청북도</option>
            <option value="충청남도">충청남도</option>
            <option value="전라북도">전라북도</option>
            <option value="전라남도">전라남도</option>
            <option value="경상북도">경상북도</option>
            <option value="경상남도">경상남도</option>
            <option value="제주특별자치도">제주특별자치도</option>
          </select>
          <select
            className="select"
            onChange={event => setFloodRiskMapSigungu(event.target.value)}
            value={floodRiskMapSigunguState ? floodRiskMapSigunguState : ""}
          >
            <option>시군구 선택</option>
            {floodRiskMapSigunguListState.map((x, idx) => (
              <option key={idx} value={x}>
                {x}
              </option>
            ))}
          </select>
          <select
            className="select"
            onChange={event => {
              setFloodRiskMapURLs([]);
              setFloodRiskMapYubmyeondong(event.target.value);
            }}
            value={floodRiskMapYubmyeondongState ? floodRiskMapYubmyeondongState : ""}
          >
            <option>읍면동 선택</option>
            {floodRiskMapYubmyeondongListState.map((x, idx) => (
              <option key={idx} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <ImageViewer
          imgs={floodRiskMapURLsState}
          noImageText={t("article:ARITLCE_FLOOD_RISK_MAP_WIDGET_NO_IMAGE_TEXT")}
        />
        {floodRiskMapURLsState.length !== 0 && (
          <div className="info-color">
            <div className="info-color-content">
              <div className="icon" style={{ backgroundColor: "#FFCC00" }}></div>
              <div className="text">{t("article:ARITLCE_FLOOD_RISK_MAP_WIDGET_INFO_1")}</div>
            </div>
            <div className="info-color-content">
              <div className="icon" style={{ backgroundColor: "#FFF559" }}></div>
              <div className="text">{t("article:ARITLCE_FLOOD_RISK_MAP_WIDGET_INFO_2")}</div>
            </div>
            <div className="info-color-content">
              <div className="icon" style={{ backgroundColor: "#35D3FF" }}></div>
              <div className="text">{t("article:ARITLCE_FLOOD_RISK_MAP_WIDGET_INFO_3")}</div>
            </div>
            <div className="info-color-content">
              <div className="icon" style={{ backgroundColor: "#C142FF" }}></div>
              <div className="text">{t("article:ARITLCE_FLOOD_RISK_MAP_WIDGET_INFO_4")}</div>
            </div>
            <div className="info-color-content">
              <div className="icon" style={{ backgroundColor: "#FF275A" }}></div>
              <div className="text">{t("article:ARITLCE_FLOOD_RISK_MAP_WIDGET_INFO_5")}</div>
            </div>
          </div>
        )}
      </WidgetBlock>
      <WidgetBlock
        widgetId="share-widget"
        icon={"🔗"}
        title={t("article:ARTICLE_SHARE_WIDGET_TITLE")}
      >
        <div className="share-btns">
          <div className="btn kakao-share-btn" onClick={kakaoShare} role="presentation">
            <img src={kakaotalkIcon} alt="" />
          </div>
          <a
            href={`http://www.facebook.com/sharer.php?u=${getShareLink()}`}
            target="_blank"
            rel="noreferrer"
          >
            <img src={facebookIcon} alt="" className="btn facebook-share-btn" />
          </a>
          <div
            className="btn copy-share-btn"
            onClick={async () => {
              await navigator.clipboard.writeText(getShareLink());
              alert(t("article:ARTICLE_SHARE_WIDGET_COPY_MSG"));
            }}
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={faLink} />
          </div>
        </div>
      </WidgetBlock>
    </>
  );
};

export default MainPage;
