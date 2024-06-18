import React, { useState, useEffect } from 'react';
import ReviewDetails from './ReviewDetails';
import './css/ImageReviewsSlider.css';

const ImageReviewsSlider = ({ Reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [limitmin, setLimitmin] = useState(0);
  const [limitsup, setLimitsup] = useState(4);
  const [showReviewDetails, setShowReviewDetails] = useState(false);
  const [reviewSelected, setReviewSelected] = useState(0);
  const [imagesToSlider, setImagesToSlider] = useState([]);

  useEffect(() => {
    const imagesToSlider = [];

    Reviews.forEach((review, index) => {
      review.images.forEach((image, idx) => {
        const imageData = {
          id: idx, // Crear un ID único para cada imagen
          src: `data:image/png;base64,${image.ImageContent}`,
          ReviewID: review.ReviewID
        };
        imagesToSlider.push(imageData);
      });
    });
    setImagesToSlider(imagesToSlider);
  }, [Reviews]);

  const handleClickNext = () => {
    if (limitsup >= imagesToSlider.length) {
      setLimitmin(0);
      setLimitsup(4);
    } else {
      setLimitmin(limitmin + 1);
      setLimitsup(limitsup + 1);
    }
  };

  const handleClickPrev = () => {
    if (limitmin <= 0) {
      setLimitmin(imagesToSlider.length - 4);
      setLimitsup(imagesToSlider.length);
    } else {
      setLimitmin(limitmin - 1);
      setLimitsup(limitsup - 1);
    }
  };

  const handleReviewDetailsToggle = (reviewID) => {
    setReviewSelected(reviewID);
    setShowReviewDetails(true);
  };

  return (
    <div className="slider-container">
      {showReviewDetails && (
        <ReviewDetails
          review={Reviews.find(review => review.ReviewID === reviewSelected)}
          onClose={() => setShowReviewDetails(false)}
        />
      )}
      <div className="arrow left" onClick={handleClickPrev}>{'<'}</div>
      <div className="slider-images">
        {imagesToSlider.slice(limitmin, limitsup).map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={`Review ${index}`}
            onClick={() => handleReviewDetailsToggle(image.ReviewID)}
          />
        ))}
      </div>
      <div className="arrow right" onClick={handleClickNext}>{'>'}</div>
    </div>
  );
};

export default ImageReviewsSlider;
