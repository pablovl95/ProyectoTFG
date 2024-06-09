import React, { useState, useEffect } from 'react';
import ReviewDetails from './ReviewDetails';
import './css/ImageReviewsSlider.css';

const ImageReviewsSlider = ({ Reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewDetails, setShowReviewDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMorePhotos, setShowMorePhotos] = useState(false);

  useEffect(() => {
    // Manejar el redimensionamiento de la ventana para cambiar el estado 'isMobile'
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // Limpieza del evento listener al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClickNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Reviews.length);
  };

  const handleClickPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Reviews.length - 1 : prevIndex - 1
    );
  };

  const handleReviewDetailsToggle = () => {
    setShowReviewDetails(!showReviewDetails);
  };

  const toggleShowMorePhotos = () => {
    setShowMorePhotos(!showMorePhotos);
  };

  return (
    <div className="slider-container">
      {showReviewDetails && (
        <ReviewDetails
          review={Reviews[currentIndex]}
          onClose={handleReviewDetailsToggle}
        />
      )}

      {!isMobile && (
        <div className="arrow left" onClick={handleClickPrev}>{'<'}</div>
      )}
      
      <div className="slider-images">
        {Reviews.map((review, index) => {
          if (review.ContainsPhotos > 0) {
            // Determinar cuántas fotos mostrar
            const imagesToShow = isMobile && !showMorePhotos ? review.images.slice(0, 4) : review.images;
            return imagesToShow.map((image, idx) => (
              <img
                key={idx}
                src={`data:image/png;base64,${image.ImageContent}`}
                alt={`Review ${index}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowReviewDetails(true);
                }}
              />
            ));
          }
          return null;
        })}
      </div>
      
      {!isMobile && (
        <div className="arrow right" onClick={handleClickNext}>{'>'}</div>
      )}
      
      {isMobile && (
        <div className="mobile-controls">
          <button onClick={handleClickPrev}>Anterior</button>
          <button onClick={handleClickNext}>Siguiente</button>
          {!showMorePhotos && Reviews.some(review => review.ContainsPhotos > 4) && (
            <button onClick={toggleShowMorePhotos}>Mostrar más fotos</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageReviewsSlider;
