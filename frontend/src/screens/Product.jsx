import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import { ClipLoader } from 'react-spinners';
import 'react-image-gallery/styles/css/image-gallery.css';
import './css/Product.css';

const Product = () => {
  const [showNav, setShowNav] = useState(window.innerWidth > 768);
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageGalleryRef = React.createRef();
  const params = useParams();
  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

  const fetchProducts = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      console.log("url",`${backendUrl}/api/v1/products?ProductID=${params.id}`)
      const productResponse = await fetch(`${backendUrl}/api/v1/products?ProductID=${params.id}`);
      if (!productResponse.ok) {
        throw new Error('Error fetching product data');
      }
      const productData = await productResponse.json();
      const urls = productData[0].ProductImages.slice(1, -1).split(',');
      const img = urls.map(url => ({
        original: url,
        thumbnail: url,
      }));
      setImages(img);
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
      setLoading(false); // Set loading to false after fetching data
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
  };

  if (loading) {
    return (
      <div style={{padding:"10rem", paddingBottom:"20rem"}}>
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
    <>
      <div className="product-container">
        <div className="product-image">
          <div ref={imageGalleryRef}>
            <ImageGallery
              items={images}
              infinite
              showPlayButton={false}
              showFullscreenButton={false}
              lazyLoad
              showNav={showNav}
              slideDuration={300}
            />
          </div>
        </div>
        <div className="product-details">
          <div className="product-header">
            <p>
              Visita la tienda de{' '}
              <Link to={`/shop/${product?.ShopID}`} style={{ textDecoration: 'none', color: 'green' }}>
                {product?.ShopName}
              </Link>
            </p>
            <p>{product?.Rating} Estrellas</p><p>({product?.TotalComments} Valoraciones)</p>
          </div>
          <h2>{product?.ProductName}</h2>
          <p>Categoría: {product?.PrincipalCategoryName}</p>
          <p>Precio: {product?.Price}</p>
          <p>Stock: {product?.StockAvailability > 0 ? 'Disponible' : 'No disponible'}</p>
          {/* <p>Peso del producto: {product?.quantity} {product?.unit}</p> */}
          {/* <p>Precio por unidad: {product?.pricePer100}</p> */}
          <div className="quantity-container">
            <label>Cantidad:</label>
            <div>-</div>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div>+</div>
          </div>
          <button className="add-to-cart-button" onClick={addToCart}>Añadir al carrito</button>
          <h3>Acerca de este producto</h3>
          <p>{product?.ProductDescription}</p>
        </div>
      </div>
      <div className="product-reviews">
        <h3>Reseñas</h3>
        {reviews.map(review => (
          <div key={review.ReviewID} className="review-item">
            <div>
              <img src={review.ProfileImageUrl} alt="User Profile" />
              <h4>{review.FirstName}</h4>
              <h4>{review.AssignedRating} Estrellas</h4>
            </div>
            <div>
              <p>{review.Comment}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Product;
