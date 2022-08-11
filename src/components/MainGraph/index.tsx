import WidgetBlock from "@Component/WidgetBlock";
import MapSVG from "@Component/MapSVG";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

import "./style.scss";

const MainGraph = () => {
  const { t } = useTranslation(["article"]);
  const [riverLevelDataStore, setRiverLevelData] = useState<RiverLevelSeoulAPIResonse | null>(null);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://openAPI.seoul.go.kr:8088/${process.env["REACT_APP_RIVER_LEVEL_SEOUL_API_KEY"]}/json/ListRiverStageService/1/1000`,
    }).then(res => {
      (res.data as RiverLevelSeoulAPIResonse).ListRiverStageService.row.forEach(itm => {
        itm.RIVER_NAME = itm.RIVER_NAME.trim();
      });
      setRiverLevelData(res.data);
    });
  }, []);

  return (
    <WidgetBlock
      icon={"🔍"}
      title={`${t("article:ARTICLE_WIDGET_TITLE_MAIN_GRAPH")} (${new Date()})`}
    >
      <MapSVG type={"seoul"} riverData={riverLevelDataStore}></MapSVG>
      {riverLevelDataStore && (
        <div className="info">
          <div className="info-color">
            <div className="info-color-riverlevel">
              <div className="text min">100%</div>
              <div className="icon"></div>
              <div className="text max">30%</div>
              <div className="text title">{t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_1")} (%)</div>
            </div>
            <div className="info-color-no-data">
              <div className="icon"></div>
              <div className="text title">{t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_2")}</div>
            </div>
          </div>
        </div>
      )}
    </WidgetBlock>
  );
};

export default MainGraph;
