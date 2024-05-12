import React from 'react';
import './css/productCard.css';
import { Link } from 'react-router-dom';
const ProductCard = ({ product }) => {

    return (
       
        <div className="product-card" >
            <div className="ImageDiv">
                <img src={product.imagen} alt={product.nombre} />
            </div>
            <div className="PrincipalData">
                <a href={`/Product/${product.id}`}>{product.nombre}</a>
            </div>
            <div className="SecondaryData">
                <p>{product.calification}</p>
                <p>{product.categoria}</p>
            </div>
            <p>{product.precio}</p>
            <div className="AddCartButton">
                    Añadir al carrito
                </div>
        </div>
    );
};

export default ProductCard;
