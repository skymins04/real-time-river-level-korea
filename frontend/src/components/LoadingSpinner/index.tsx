import loadingSpinnerGif from "@Public/loading-spin.gif";

import "./style.scss";

interface LoadingSpinnerProps {
  marginTop?: string;
  marginBottom?: string;
}

const LoadingSpinner = ({ marginTop, marginBottom }: LoadingSpinnerProps) => {
  return (
    <div className="loading-spinner" style={{ marginTop, marginBottom }}>
      <img src={loadingSpinnerGif} alt="" />
    </div>
  );
};

export default LoadingSpinner;
