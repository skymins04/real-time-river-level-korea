import WidgetBlock from "@Component/WidgetBlock";
import MapSVG from "@Component/MapSVG";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

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

  useEffect(() => {
    console.log(riverLevelDataStore);
  }, [riverLevelDataStore]);

  const printData = () => {
    console.log(riverLevelDataStore);
  };

  return (
    <WidgetBlock
      icon={<div style={{ width: "10px", height: "10px", background: "red" }}></div>}
      title={`${t("article:ARTICLE_WIDGET_TITLE_MAIN_GRAPH")} (${new Date()})`}
    >
      <MapSVG type={"seoul"} riverData={riverLevelDataStore}></MapSVG>
    </WidgetBlock>
  );
};

export default MainGraph;
