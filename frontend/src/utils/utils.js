// utils.js
import "./utils.css"
const buildURLSearchParams = (filters) => {
  const searchParams = new URLSearchParams(filters);
  return Array.from(searchParams.entries())
    .filter(([key, value]) => value !== '')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

const renderStars = (minRating, handleStarClick) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= minRating ? 'selected' : ''}`}
        onClick={() => handleStarClick(i)}
      >
        &#9733;
      </span>
    );
  }
  return stars;
};
const renderStarsProductCard = (rating) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const halfStar = rating - filledStars >= 0.5 ? true : false;
  const stars = [];

  for (let i = 1; i <= totalStars; i++) {
    if (i <= filledStars) {
      stars.push(
        <span key={i} className='filled'>★</span>
      );
    } else if (i === filledStars + 1 && halfStar) {
      stars.push(
        <span key={i} className='half-filled'>★</span>
      );
    } else {
      stars.push(
        <span key={i}>★</span>
      );
    }
  }

  return stars;
};


const renderCardReviews = (reviews) => {
  return reviews.map(review => (
    <div key={review.ReviewID} className="review-item">
      <div className="header-comment">

        <img src={review.ProfileImageUrl} alt="User Profile" />
        <h4>{review.FirstName}</h4>

      </div>
      <div className="product-card-rating">
            {renderStarsProductCard(review.AssignedRating)}
        </div>
      <div>
        <p>{review.Comment}</p>
      </div>
    </div>
  ));
}

const calculateStarsPercentage = (product, reviews) => {
  const totalReviews = product.TotalComments; // Total de valoraciones
  const starsCount = {}; // Objeto para almacenar el recuento de estrellas

  // Contar el número de valoraciones para cada cantidad de estrellas
  reviews.forEach(review => {
    const stars = review.AssignedRating;
    starsCount[stars] = (starsCount[stars] || 0) + 1;
  });

  // Calcular el porcentaje para cada cantidad de estrellas
  const starsPercentage = {};
  for (let i = 1; i <= 5; i++) {
    starsPercentage[i] = ((starsCount[i] || 0) / totalReviews) * 100;
  }

  return starsPercentage;
};

export { buildURLSearchParams, renderStars, renderStarsProductCard, renderCardReviews, calculateStarsPercentage };  