import React from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './css/Product.css';

const Product = () => {
const showNav = (window.innerWidth > 768) ? true : false;
const imageGalleryRef = React.createRef(null);
  const product={
    "name": "Brocoli",
    "quantity": 500,
"price": 2.99,
    "unit": "g",
    "images": [{
      original: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
      thumbnail: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
    },
    {
      original: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
      thumbnail: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
    },
    {
      original: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
      thumbnail: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
    },
    {
      original: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
      thumbnail: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
    },
    {
      original: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
      thumbnail: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
    },
    {
      original: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
      thumbnail: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
    }],
    "type": "Vegetables",
    "pricePer100": 5,
    "description": "Brocoli fresco de la huerta de la abuela",
    "shopId": 3,
    "rating": 4.8,
    "reviews": 150,
    "stock": true
  }

  return (
    <div className="product-container">
      <div className="product-image">
        <div ref={imageGalleryRef}>
          <ImageGallery
            items={product.images}
            infinite={true}
            showPlayButton={false}
            showFullscreenButton={false}
            lazyLoad={true}
            showNav={showNav}
            slideDuration={300}
          />
        </div>
      </div>
      <div className="product-details">
        <div className="product-header">
          <p>Visita la tienda de <Link to={`/shop/`+product.shopId}>{product.shopId}</Link></p>
          <p>{product.rating} Estrellas</p>
        </div>
        <h2>{product.name}</h2>
        <p>Categoría: {product.type}</p>
        <p>Precio: {product.price}</p>
        <p>Stock: {product.stock ? 'Disponible' : 'No disponible'}</p>
        <p>Peso del producto: {product.quantity} {product.unit}</p>
        <p>Precio por unidad: {product.pricePer100}</p>
        <div className="quantity-container">
          <label>Cantidad:</label>
          <div>-</div>
          <input type="number" min="1" max="100" defaultValue={1} />
          <div>+</div>
        </div>
        <button className="add-to-cart-button">Añadir al carrito</button>
        <h3>Acerca de este producto</h3>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default Product;