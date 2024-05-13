import React from 'react';
import './css/productCard.css';
import { Link } from 'react-router-dom';
const ProductCard = ({ product }) => {
    const imageUrls = product?.ProductImages.slice(1, -1).split(',');

    // Obtener la primera URL de imagen del producto
    const firstImageUrl = imageUrls[0]?.trim();

    return (

        <div className="product-card" >
            <div className="ImageDiv">
                <img src={firstImageUrl} alt={product?.ProductName} />
            </div>
            <div className="PrincipalData">
                <a href={`/Product/${product?.ProductID}`}>{product?.ProductName}</a>
            </div>
            <div className="SecondaryData">
                <p>{product?.Rating}</p>
                <p>{product?.PrincipalCategoryId}</p>
            </div>
            <p>{product?.Price}</p>
            <div className="AddCartButton">
                Añadir al carrito
            </div>
        </div>
    );
};

export default ProductCard;
