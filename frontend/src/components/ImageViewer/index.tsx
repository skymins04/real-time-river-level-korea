import { useEffect, useState } from "react";
import { faAngleLeft, faAngleRight, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.scss";
import LoadingSpinner from "@Component/LoadingSpinner";

interface ImageViewerProps {
  imgs: string[];
  noImageText: string;
}

const ImageViewer = ({ imgs, noImageText }: ImageViewerProps) => {
  const [imagesState, setImages] = useState<string[]>(imgs);
  const [selectedImageIndexState, setSelectedImageIndex] = useState<number>(0);
  const [isFixedViewState, setIsFixedView] = useState<boolean>(false);
  const [imageLoadingState, setImageLoading] = useState<boolean>(false);

  useEffect(() => {
    setSelectedImageIndex(0);
    setImages(imgs);
  }, [imgs]);

  useEffect(() => {
    setImageLoading(false);
  }, [imagesState]);

  const showFixedView = () => {
    if (imagesState.length !== 0) setIsFixedView(true);
  };

  const ImageViewerControls = () => {
    return (
      <>
        {imagesState.length > 1 && (
          <>
            <div
              className="left-btn"
              role="presentation"
              onClick={event => {
                event.stopPropagation();
                if (selectedImageIndexState > 0) setSelectedImageIndex(selectedImageIndexState - 1);
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>
            <div
              className="right-btn"
              role="presentation"
              onClick={event => {
                event.stopPropagation();
                if (selectedImageIndexState < imagesState.length - 1)
                  setSelectedImageIndex(selectedImageIndexState + 1);
              }}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="image-viewer">
      <div className="img-wrap">
        <ImageViewerControls />
        {imagesState.length === 0 ? (
          <div className="no-image">{noImageText}</div>
        ) : (
          <>
            {!imageLoadingState && <LoadingSpinner />}
            <img
              src={imagesState[selectedImageIndexState]}
              role="presentation"
              style={{ display: imageLoadingState ? "block" : "none" }}
              onClick={showFixedView}
              alt=""
              onLoad={() => setImageLoading(true)}
            />
          </>
        )}
      </div>
      {isFixedViewState && (
        <div className="fixed-view" role="presentation" onClick={() => setIsFixedView(false)}>
          <div className="img-wrap">
            <FontAwesomeIcon icon={faClose} className="image-viwer-close" />
            <img
              src={imagesState[selectedImageIndexState]}
              role="presentation"
              onClick={event => event.stopPropagation()}
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
