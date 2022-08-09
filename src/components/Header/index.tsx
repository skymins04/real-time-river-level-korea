import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import "./style.scss";

const Header = () => {
  const { t } = useTranslation(["header"]);
  return (
    <>
      <div className="header">
        <div className="header-title">
          <div className="icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="text">{t("header:PAGE_MAIN_TITLE")}</div>
        </div>
      </div>
    </>
  );
};

export default Header;
