import React, { useEffect, useState } from 'react';
import './css/ReviewDetails.css';

const ReviewDetails = ({ review, onClose }) => {
    const [mainImage, setMainImage] = useState(review.images[0].ImageContent);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    const handleImageClick = (imageContent) => {
        setMainImage(imageContent);
    };

    const handlePrevImage = (e) => {
        setMainImageIndex((prevIndex) => (prevIndex === 0 ? review.images.length - 1 : prevIndex - 1));
        e.stopPropagation();
    };

    const handleNextImage = (e) => {
        setMainImageIndex((prevIndex) => (prevIndex === review.images.length - 1 ? 0 : prevIndex + 1));
        e.stopPropagation();
    };

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    useEffect(() => {
        setMainImage(review.images[mainImageIndex].ImageContent);
    }, [mainImageIndex, review]);

    return (
        <div className="review-details-overlay" onClick={onClose}>
            <div className="review-details-content" onClick={(e) => e.stopPropagation()}>
                <div className='review-details-close' onClick={onClose}>
                    X
                </div>

                <button className="slider-arrow left" onClick={handlePrevImage}>
                    &#8249;
                </button>

                <div className="review-details-image">
                    <img
                        src={`data:image/png;base64,${mainImage}`}
                        alt={`Review ${review.index}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                <button className="slider-arrow right" onClick={handleNextImage}>
                    &#8250;
                </button>

                <div className="review-details-details">
                    <h2>{review.FirstName}</h2>
                    <p>Valoración: {review.AssignedRating}</p>
                    <p>{review.Comment}</p>
                    <div className="review-details-images">
                        {review.images.map((image, idx) => (
                            <img
                                key={idx}
                                src={`data:image/png;base64,${image.ImageContent}`}
                                alt={`Review ${review.index}`}
                                onClick={() => {
                                    handleImageClick(image.ImageContent);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetails;
