import { useTranslation } from "react-i18next";
import "./style.scss";

interface PopupRegionInfoProps {
  region: Region;
  mouseX: number;
  mouseY: number;
}

const PopupRegionInfo = ({ region, mouseX, mouseY }: PopupRegionInfoProps) => {
  const { t } = useTranslation(["article", "region"]);

  return (
    <div
      className="popup-region-info"
      style={{
        left: `${mouseX - 15}px`,
        top: `${mouseY}px`,
      }}
    >
      <div className="region-name">{t(`region:REGION_${region.guName}`)}</div>
      <div className="region-river-data-content average-river-level-ratio">
        <div className="title">{t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_1")}:</div>
        <div className="data">
          {region.averageRiverLevelRatio
            ? (region.averageRiverLevelRatio * 100).toFixed(2).toString() + " %"
            : t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_2")}
        </div>
      </div>
      {region.riverLevel.map((itm, idx) => (
        <div key={idx} className="region-river-data">
          <div className="region-river-name">
            {t(`region:REGION_RIVER_${itm.riverName}`)} - {itm.rivergaugeName}
          </div>
          <div className="region-river-data-content region-river-current-level">
            <div className="title">{t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_3")}:</div>
            <div className="data">{itm.currentLevel} m</div>
          </div>
          <div className="region-river-data-content region-river-planflood-level">
            <div className="title">{t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_4")}:</div>
            <div className="data">{itm.planfloodLevel} m</div>
          </div>
          <div className="region-river-data-content region-river-level-ratio">
            <div className="title">{t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_5")}:</div>
            <div className="data">{(itm.riverLevelRatio * 100).toFixed(2)} %</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopupRegionInfo;
