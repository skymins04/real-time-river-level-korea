import { useTranslation } from "react-i18next";

import "./style.scss";

const Footer = () => {
  const { t } = useTranslation(["header", "footer"]);
  return (
    <div className="footer">
      <div className="footer-content">
        🛠 GitHub Repo :
        <a href="https://github.com/skymins04/river-level-seoul">
          {t("footer:FOOTER_GITHUB_REPO_LINK")}
        </a>
      </div>
      <div className="footer-content">
        📊 {t("footer:FOOTER_RIVER_LEVEL_SOEUL_API_SITE")}
        <a href="https://data.seoul.go.kr/dataList/OA-1167/S/1/datasetView.do">
          ({t("footer:FOOTER_SITE_LINK")})
        </a>
      </div>
      <div className="footer-content footer-copyright">© 2022 {t("header:HEADER_TITLE")}</div>
    </div>
  );
};

export default Footer;
