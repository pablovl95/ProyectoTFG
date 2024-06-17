import React, { useState } from 'react';
import './css/productCard.css';
import { useNavigate } from 'react-router-dom';
import { renderStarsProductCard } from '../utils/utils';

const ProductCard = ({ product, changeCart }) => {
    const navigate = useNavigate();
    const imageUrl = product?.ImageContent;

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart"));
        const existingProductIndex = cart.findIndex(item => item.ProductID === product?.ProductID);
        const ShippingCost = product?.productInfo?.Shipping_cost ? product?.productInfo?.Shipping_cost : 4.99;
        const MinUnits = product?.productInfo?.Min_units_for_free_shipping ? product?.productInfo?.Min_units_for_free_shipping : 5;
        const updatedProduct = { ...product, quantity: 1, ShippingCost, MinUnits };
    
        if (existingProductIndex !== -1) {
          const updatedCart = [...cart];
          updatedCart[existingProductIndex].quantity += 1;
          updatedCart[existingProductIndex].ShippingCost = ShippingCost;
          updatedCart[existingProductIndex].MinUnits = MinUnits;
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        } else {
          const updatedCart = [...cart, updatedProduct];
          localStorage.setItem("cart", JSON.stringify(updatedCart));
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
