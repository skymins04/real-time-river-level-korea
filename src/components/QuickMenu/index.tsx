import { faAngleUp, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.scss";

const QuickMenu = () => {
  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToShare = () => {
    window.scrollTo({
      top: document.getElementById("share-widget")?.getBoundingClientRect().top,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="quick-menu">
        <div className="share" onClick={goToShare} aria-hidden="true">
          <FontAwesomeIcon icon={faShare} />
        </div>
        <div className="go-to-top" onClick={goToTop} aria-hidden="true">
          <FontAwesomeIcon icon={faAngleUp} />
        </div>
      </div>
    </>
  );
};

export default QuickMenu;
