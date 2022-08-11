import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import i18n from "@i18n";
import "./style.scss";

const Header = () => {
  const { t } = useTranslation(["header"]);

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
          Langauge :
          <select id="lang-select" onChange={selectLanguage}>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Header;
