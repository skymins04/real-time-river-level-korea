import { faChartLine, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import i18n from "@i18n";
import { useRiverLevelData } from "@Hook";

import "./style.scss";

const Header = () => {
  const reduxDispatch = useDispatch();
  const getRiverLevelData = useRiverLevelData();
  const { selectedCity } = useSelector((reducer: any) => {
    const state: RootState = reducer["main"];
    return {
      selectedCity: state.selectedCity,
    };
  });

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
    document.title = t("header:HEADER_TITLE");
  };

  const selectCity = (event: any) => {
    switch (event.target.value) {
      case "seoul":
      case "daejeon":
        reduxDispatch({ type: "SELECT_CITY", selectedCity: event.target.value });
        break;
    }
  };

  const clickRefresh = () => {
    getRiverLevelData(selectedCity);
  };

  return (
    <>
      <div className="header">
        <div className="header-title">
          <div className="icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="text">
            {t("header:HEADER_TITLE")}{" "}
            <span className="beta" style={{ fontSize: "12px" }}>
              Beta
            </span>
          </div>
        </div>
        <div className="control-bar">
          <select id="lang-select" className="btn" onChange={selectLanguage}>
            <option>Langauge</option>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
          <select id="city-select" className="btn" onChange={selectCity}>
            <option value="seoul">{t("region:REGION_CITY_SEOUL")}</option>
          </select>
          <button className="btn" onClick={clickRefresh}>
            <FontAwesomeIcon icon={faArrowRotateRight} />
            {t("header:HEADER_REFRESH")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
