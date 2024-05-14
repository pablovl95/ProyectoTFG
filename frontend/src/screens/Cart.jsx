import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/Cart.css'; // Importa el archivo CSS

const Cart = () => {
  const [cart, setCart] = useState([]);
  

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.ProductID !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    // Implementa la lógica para finalizar la compra
    console.log('Lógica de finalizar compra aquí');
  };

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <div>
          {cart.map(item => (
            <Link to={`/product/${item.ProductID}`} style={{textDecoration:"none", color:"black"}}>
            <div key={item.ProductID} className="cart-item">
              <img src={item.ProductImages.slice(1, -1).split(',')[0]?.trim()} alt={item.ProductName} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.ProductName}</h3>
                <p>Precio: ${item.Price}</p>
                <p>Cantidad: {item.quantity}</p>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => handleRemoveFromCart(item.ProductID)}>Eliminar del carrito</button>
              </div>
            </div>
            </Link>
          ))}
          <div className="cart-total">
            <h3>Total del Carrito: ${cart.reduce((total, item) => total + item.Price * item.quantity, 0)}</h3>
            <button className="checkout-button" onClick={handleCheckout}>Finalizar Compra</button>
          </div>
        </div>
      )}
      <Link to="/" className="back-to-shop-link">Volver a la Tienda</Link>
    </div>
  );
};

export default Cart;
