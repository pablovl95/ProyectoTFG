import "./utils.css"

function generateCustomSequence() {
  // Genera una secuencia de bytes aleatorios y conviértela a una cadena hexadecimal en minúsculas
  function randomHexBytes(n) {
    const bytes = new Uint8Array(n);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Genera la cuarta parte de la secuencia basada en la especificación
  function generatePart4() {
    const chars = '89ab';
    const randomIndex = Math.floor(Math.random() * 4);
    return chars[randomIndex];
  }

  // Construye la secuencia
  const part1 = randomHexBytes(4);
  const part2 = randomHexBytes(2);
  const part3 = randomHexBytes(2).substring(1); // Quita el primer carácter
  const part4 = generatePart4(); // Generar el cuarto segmento basado en la especificación
  const part5 = randomHexBytes(2).substring(1); // Quita el primer carácter
  const part6 = randomHexBytes(6);

  // Combinar todas las partes
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

const PaymentForm = ({ selectOption, setOpenPaymentForm }) => {
  switch (selectOption) {
      case 'Tarjeta de crédito':
          return (
              <div>
                  <h3>Pago con Tarjeta de Crédito</h3>
                  <form>
                      <div>
                          <label>Número de tarjeta:</label>
                          <input type="text" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div>
                          <label>Fecha de caducidad:</label>
                          <input type="text" placeholder="MM/AA" />
                      </div>
                      <div>
                          <label>CVV:</label>
                          <input type="text" placeholder="123" />
                      </div>
                      <div>
                          <label>Nombre del titular de la tarjeta:</label>
                          <input type="text" placeholder="" />
                      </div>
                      <button type="submit">Guardar</button>
                  </form>
                  <button onClick={() => setOpenPaymentForm(false)}>Cerrar</button>
              </div>
          );
      case 'Bizum':
          return (
              <div>
                  <h3>Pago con Bizum</h3>
                  <form>
                      <div>
                          <label>Número de teléfono:</label>
                          <input type="text" placeholder="123 456 789" />
                      </div>
                      <button type="submit">Guardar</button>
                  </form>
                  <button onClick={() => setOpenPaymentForm(false)}>Cerrar</button>
              </div>
          );
      case 'Paypal':
          return (
              <div>
                  <h3>Pago con PayPal</h3>
                  <button type="button">Pagar con PayPal</button>
                  <button onClick={() => setOpenPaymentForm(false)}>Cerrar</button>
              </div>
          );
      case 'Google play':
          return (
              <div>
                  <h3>Pago con Google Play</h3>
                  <button type="button">Pagar con Google Play</button>
                  <button onClick={() => setOpenPaymentForm(false)}>Cerrar</button>
              </div>
          );
      case 'Apple pay':
          return (
              <div>
                  <h3>Pago con Apple Pay</h3>
                  <button type="button">Pagar con Apple Pay</button>
                  <button onClick={() => setOpenPaymentForm(false)}>Cerrar</button>
              </div>
          );
      default:
          return <div>Por favor, selecciona un método de pago.</div>;
  }
};


export { PaymentForm, buildURLSearchParams, StatusTranslation, renderStars, renderStarsProductCard, calculateStarsPercentage, generateCustomSequence };  