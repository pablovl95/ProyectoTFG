import React from 'react';
import './css/productCard.css';
import { Link } from 'react-router-dom';
const ProductCard = ({ product }) => {
    const imageUrls = product?.ProductImages.slice(1, -1).split(',');

    // Obtener la primera URL de imagen del producto
    const firstImageUrl = imageUrls[0]?.trim();

    return (
        <Link to={`/product/${product.ProductID}`} className="product-card" >
            <div className="ImageDiv">
                <img src={firstImageUrl} alt={product?.ProductName} />
            </div>
            <div className="PrincipalData">
                {product?.ProductName}
            </div>
            <div className="SecondaryData">
                <p>{product?.Rating}</p>
                <p>{product?.PrincipalCategoryName}</p>
            </div>
            <p>{product?.Price}</p>
            <div className="AddCartButton">
                Añadir al carrito
            </div>
        </Link >

    );
};

export default ProductCard;
