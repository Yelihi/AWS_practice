import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";

import ImagesZoom from "./ImagesZoom";

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <img
          role="presentation"
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          role="presentation"
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
          style={{ width: "50%", display: "inline-block" }}
        />
        <img
          role="presentation"
          src={`http://localhost:3065/${images[1].src}`}
          alt={images[1].src}
          onClick={onZoom}
          style={{ width: "50%", display: "inline-block" }}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length >= 3) {
    return (
      <>
        <div>
          <img
            role="presentation"
            src={`http://localhost:3065/${images[0].src}`}
            alt={images[0].src}
            onClick={onZoom}
            style={{ width: "50%" }}
          />
          <div
            role="presentation"
            style={{
              display: "inline-block",
              width: "50%",
              textAlign: "center",
              verticalAlign: "middle",
            }}
            onClick={onZoom}
          >
            <PlusOutlined />
            <br />
            {images.length - 1} 개의 더보기
          </div>
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return <div>구현중...</div>;
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
