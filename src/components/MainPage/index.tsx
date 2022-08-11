import WidgetBlock from "@Component/WidgetBlock";
import MainGraph from "@Component/MainGraph";

import "./style.scss";
import { useTranslation } from "react-i18next";

const MainPage = () => {
  const { t } = useTranslation(["article"]);
  return (
    <>
      <MainGraph />
      <div className="sub-articles">
        <WidgetBlock icon={"📊"} title={`${t("article:ARTICLE_WIDGET_TITLE_DETAIL_GRAPH")}`}>
          <h1>hello world</h1>
        </WidgetBlock>
        <WidgetBlock icon={"📰"} title={"News"}>
          <h1>hello world</h1>
        </WidgetBlock>
      </div>
    </>
  );
};

export default MainPage;
