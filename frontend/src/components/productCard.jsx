import React, { useState } from 'react';
import './css/productCard.css';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const imageUrls = product?.ProductImages.slice(1, -1).split(',');
    const firstImageUrl = imageUrls[0]?.trim();

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
    };

    const navigateToProduct = () => {
        navigate(`/product/${product.ProductID}`);
    };

    return (
        <div onClick={navigateToProduct} style={{ color: "black" }} className="product-card">
            <div className="product-card-image">
                <img src={firstImageUrl} alt={product?.ProductName} />
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
                    {renderStars(product?.Rating)}
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
