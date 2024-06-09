import React, { useState } from "react";
import "./css/CardReviews.css";
import ReviewDetails from "./ReviewDetails";
import { renderStarsProductCard } from "../utils/utils";

const CardReviews = ({ Reviews }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const handleReviewClick = (review) => {
        setSelectedReview(review);
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedReview(null);
    };

    return (
        <div className="card-reviews-container">
            {Reviews.map((review, index) => (
                <div key={index} className="card-review-item">
                    <div className="card-review-header">
                        <h4>{review.FirstName}</h4>
                        {renderStarsProductCard(review.AssignedRating)}
                    </div>
                    <div className="card-review-date">
                        <p>{new Date(review.UploadDate).toLocaleDateString()}</p>
                    </div>
                    <div className="card-review-images">
                        {review.images?.map((image, imgIndex) => (
                            <img
                                key={imgIndex}
                                src={`data:image/png;base64,${image.ImageContent}`}
                                alt={`Review ${imgIndex}`}
                                onClick={() => handleReviewClick(review)}
                            />
                        ))}
                    </div>
                    <div className="card-review-comment">
                        <p>{review.Comment}</p>
                    </div>
                </div>
            ))}
            {showDetails && selectedReview && (
                <ReviewDetails review={selectedReview} onClose={handleCloseDetails} />
            )}
        </div>
    );
};

export default CardReviews;
