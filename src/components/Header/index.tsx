import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import reduxStore from "@Redux";
import i18n from "@i18n";

import "./style.scss";

const Header = () => {
  const { t } = useTranslation(["header", "region"]);

  const selectLanguage = (event: any) => {
    switch (event.target.value) {
      case "ko":
        i18n.changeLanguage("ko");
        break;
      case "en":
        i18n.changeLanguage("en");
        break;
    }
  };

  const selectCity = (event: any) => {
    switch (event.target.value) {
      case "seoul":
      case "daejeon":
        reduxStore.dispatch({ type: "SELECT_CITY", selectedCity: event.target.value });
        break;
    }
  };

  return (
    <>
      <div className="header">
        <div className="header-title">
          <div className="icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="text">{t("header:HEADER_TITLE")}</div>
        </div>
        <div className="lang-select-area">
          <select id="lang-select" className="selectBox" onChange={selectLanguage}>
            <option>Langauge</option>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
          <select id="city-select" className="selectBox" onChange={selectCity}>
            <option value="seoul">{t("region:REGION_CITY_SEOUL")}</option>
            <option value="daejeon">대전시</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Header;
