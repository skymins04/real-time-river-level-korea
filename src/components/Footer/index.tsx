import { useTranslation } from "react-i18next";

import "./style.scss";

const Footer = () => {
  const { t } = useTranslation(["header", "footer"]);
  return (
    <div className="footer">
      <div className="footer-content warning">
        ⚠️ 본 사이트에서 제공하는 실시간 하천수위/강수량 정보는 각 시도 별 공공데이터를 후처리하여
        자체적으로 통계 및 시각화된 자료입니다. 이는 공식적 근거 자료로써 활용될 수 없고 이로인해
        발생된 문제의 책임은 사용자에게 있습니다.
      </div>
      <div className="footer-content">
        🛠 GitHub Repo :
        <a href="https://github.com/skymins04/real-time-river-level-korea">
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
