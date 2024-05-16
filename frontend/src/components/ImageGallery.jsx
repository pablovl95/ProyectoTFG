import React, { useState } from "react";
import "./css/ImageGallery.css";

function ImageGallery({ imageUrls }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="image-gallery">
          <div className="thumbnails">
        {imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Thumbnail ${index + 1}`}
            className={currentIndex === index ? "active" : ""}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
      <div className="main-image">
        <img src={imageUrls[currentIndex]} alt={`Image ${currentIndex + 1}`} />
      </div>

    </div>
  );
}

export default ImageGallery;
