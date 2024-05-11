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
                <p>{product.categoria}</p>
                <a href={`/Product/${product.id}`}>{product.nombre}</a>
            </div>
            <div className="SecondaryData">
                <p>{product.calification}</p>
                <p>{product.precio}</p>
            </div>
            <div className="AddCartButton">
                    Añadir al carrito
                </div>
        </div>
    );
};

export default ProductCard;
