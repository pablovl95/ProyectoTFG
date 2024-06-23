import "./utils.css"

function generateCustomSequence() {
  function randomHexBytes(n) {
    const bytes = new Uint8Array(n);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function generatePart4() {
    const chars = '89ab';
    const randomIndex = Math.floor(Math.random() * 4);
    return chars[randomIndex];
  }

  const part1 = randomHexBytes(4);
  const part2 = randomHexBytes(2);
  const part3 = randomHexBytes(2).substring(1);
  const part4 = generatePart4(); 
  const part5 = randomHexBytes(2).substring(1); 
  const part6 = randomHexBytes(6);

  return part1 + part2 + part3 + part4 + part5 + part6;
}

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


const calculateStarsPercentage = (product, reviews) => {
  const totalReviews = product.TotalComments;
  const starsCount = {}; 

  reviews.forEach(review => {
    const stars = review.AssignedRating;
    starsCount[stars] = (starsCount[stars] || 0) + 1;
  });


  if (totalReviews === 0) {

    return {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
  }


  const starsPercentage = {};
  for (let i = 1; i <= 5; i++) {
    starsPercentage[i] = Math.round(((starsCount[i] || 0) / totalReviews) * 100);
  }

  return starsPercentage;
};


function StatusTranslation(status) {
  switch (status) {
    case 'delivered':
      return 'Entregado';
    case 'shipped':
      return 'Enviado';
    case 'pending':
      return 'Pendiente';
    case 'cancelled':
      return 'Cancelado';
    case 'archived':
      return 'Archivado';
    default:
      return status;
  }
}



export {  buildURLSearchParams, StatusTranslation, renderStars, renderStarsProductCard, calculateStarsPercentage, generateCustomSequence };  