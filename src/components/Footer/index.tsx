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
        👨‍💻 Project by Kang Min-su (BetaMan, skymin0417@gmail.com)
      </div>
      <div className="footer-content footer-copyright">© 2022 {t("header:HEADER_TITLE")}</div>
    </div>
  );
};

export default Footer;
