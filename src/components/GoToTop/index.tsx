import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.scss";

const GoToTop = () => {
  return (
    <div
      className="go-to-top"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <FontAwesomeIcon icon={faAngleUp} />
    </div>
  );
};

export default GoToTop;
