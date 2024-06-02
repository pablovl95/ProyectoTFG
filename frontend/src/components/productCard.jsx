import React, { useState } from 'react';
import './css/productCard.css';
import { useNavigate } from 'react-router-dom';
import { renderStarsProductCard } from '../utils/utils';

const ProductCard = ({ product, changeCart }) => {
    const navigate = useNavigate();
    const imageUrl = product?.ImageContent;

    const addToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = existingCart.findIndex(item => item.ProductID === product.ProductID);
        if (existingProductIndex !== -1) {
            const updatedCart = [...existingCart];
            updatedCart[existingProductIndex].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
            const updatedCart = [...existingCart, { ...product, quantity: 1 }];
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
        changeCart();
    };

    const navigateToProduct = () => {
        navigate(`/product/${product.ProductID}`);
    };

    return (
        <div onClick={navigateToProduct} style={{ color: "black" }} className="product-card">
            <div className="product-card-image">
                <img src={"data:image/png;base64,"+imageUrl} alt={product?.ProductName} />
                <span>{product?.StockAvailability > 0 ? 'Disponible' : 'No disponible'}</span>
            </div>
            <div className="product-card-details">
                <h2>{product?.ProductName}</h2>
            </div>
            <div className="product-card-category">
                <span>{product?.SecundaryCategoryName ? product?.SecundaryCategoryName : product?.PrincipalCategoryName}</span>
            </div>
            <div className="product-card-rating-comments">
                <div className="product-card-rating">
                    {renderStarsProductCard(product?.Rating)}
                </div>
                <p>{product?.TotalComments}</p>
            </div>
            <p>{product?.Price} €</p>
            <div className="product-card-add-to-cart-button" onClick={(e) => { e.stopPropagation(); addToCart(); }}>
                Añadir al carrito
            </div>
        </div>
    );
};

export default ProductCard;
