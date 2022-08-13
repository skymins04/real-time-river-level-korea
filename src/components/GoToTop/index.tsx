import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.scss";

const GoToTop = () => {
  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="go-to-top" onClick={goToTop} aria-hidden="true">
      <FontAwesomeIcon icon={faAngleUp} />
    </div>
  );
};

export default GoToTop;
