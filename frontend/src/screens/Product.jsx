import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import ImageGallery from '../components/ImageGallery';
import './css/Product.css';
import {renderCardReviews } from '../utils/utils';

const Product = ({changeCart}) => {
  const [showNav, setShowNav] = useState(window.innerWidth > 768);
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageGalleryRef = React.createRef();
  const params = useParams();

  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

    const renderStars = (rating) => {
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
    
  const calculateStarsPercentage = () => {
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

  const totalStarsPercentaje = calculateStarsPercentage();
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productResponse = await fetch(`${backendUrl}/api/v1/products/${params.id}`);
      if (!productResponse.ok) {
        throw new Error('Error fetching product data');
      }
      const productData = await productResponse.json();
      //console.log(productData);
      const urls = productData.map(product => product.ImageContent);
      // console.log(urls);
      setImages(urls);
      setProduct(productData[0]);
      const reviewsResponse = await fetch(`${backendUrl}/api/v1/reviews/${params.id}`);
      if (!reviewsResponse.ok) {
        throw new Error('Error fetching reviews data');
      }
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setShowNav(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = () => {
    const existingProductIndex = cart.findIndex(item => item.ProductID === product.ProductID);
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += parseInt(quantity, 10);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: parseInt(quantity, 10) }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    changeCart();
  };

  if (loading) {
    return (
      <div style={{ padding: "10rem", paddingBottom: "20rem" }}>
        <ClipLoader
          color={"green"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className='product-container-global'>
      <p className="breadcrumbs">
        <Link to={`/search?PrincipalCategoryId=${product?.PrincipalCategoryID}`} style={{ textDecoration: 'none', color: 'green' }}>
          {"Productos > "}{product?.PrincipalCategoryName} {product?.SecundaryCategoryName ? ' > ' : ''} {product?.SecundaryCategoryName} {product?.TertiaryCategoryName ? ' > ' : ''} {product?.TertiaryCategoryName}
        </Link>
      </p>
      <div className="product-container">
        <div className="product-image">
          <p>{product?.StockAvailability > 0 ? 'Disponible' : 'No disponible'}</p>
          <ImageGallery imageUrls={images} />
        </div>
        <div className="product-details">
          <div className="product-header">
            <h2>{product?.ProductName}</h2>
            <p>
              Visita la tienda de{' '}
              <Link to={`/shop/${product?.ShopID}`} style={{ textDecoration: 'none', color: 'green' }}>
                {product?.ShopName}
              </Link>
            </p>
            <div>
              <p>
                {product?.Rating} {renderStars(product?.Rating)}
                {" | "}
                <a href="#comentarios" style={{ textDecoration: 'none', color: 'green' }}>
                  {product?.TotalComments} Valoraciones | Buscar en esta página
                </a>
              </p>

            </div>
            <h1>{(product?.Price * quantity).toFixed(2)} €</h1>
            <a> 0,99 €/kg</a>
          </div>
          <div className="quantity-container">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              />
              <button onClick={() => setQuantity(Math.min(100, quantity + 1))}>+</button>
            </div>
            <button className="add-to-cart-button" onClick={addToCart}>Añadir al carrito</button>
          </div>
          <div className="product-description">
            <h3>Acerca de este producto</h3>
            <p>{product?.ProductDescription}</p>
          </div>
        </div>
      </div>
      <div className="separator"></div>
      <div>
        <h2>Información adicional sobre el producto</h2>
      </div>
      <div className="separator"></div>
      {/* Renderizar las reseñas solo si hay comentarios */}
      {reviews.length > 0 && (
        <div id="comentarios" className="product-reviews">
          <div className="Opiniones">
            <h3>Opiniones de clientes</h3>
            <div className="StarsTitle">
              {renderStars(product?.Rating)} {product?.Rating} Estrellas de 5
            </div>
            {product?.TotalComments} Valoraciones totales

            {[5, 4, 3, 2, 1].map(stars => (

              <div key={stars} className="starsLine">
                <a>{stars} Estrellas</a>
                <div className="WidthDiv">
                  <div className="WidthPercentaje" style={{ width: `${totalStarsPercentaje[stars]}%` }}></div>
                </div>
                {totalStarsPercentaje[stars]}%
              </div>

            ))}

          </div>
          <div className="Reseñas">
            <h2>Principales Reseñas</h2>
            {renderCardReviews(reviews)}
          </div>
        </div>
      )}
      {/* Si no hay comentarios, mostrar un mensaje */}
      {reviews.length === 0 && (
        <div>
          <p>No hay valoraciones disponibles</p>
        </div>
      )}
    </div>
  );
};

export default Product;
