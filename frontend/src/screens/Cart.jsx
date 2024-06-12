import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';
import Shipping from '../components/profile/Shipping';
import Payment from '../components/profile/Payment';
import './css/Cart.css';

const Cart = ({ changeCart, userData }) => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [activeComponent, setActiveComponent] = useState('cart');
  const [AddressID, setAddressID] = useState('');
  const [passComponent, setPassComponent] = useState(['cart']);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
      setCartTotal(calculateCartTotal(parsedCart));
    }
  }, []);

  const calculateCartTotal = (cart) => {
    return cart.reduce((total, item) => total + item.Price * item.quantity, 0).toFixed(2);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.ProductID !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartTotal(calculateCartTotal(updatedCart));
    changeCart();
  };

  const handleQuantityChange = (productId, amount) => {
    const updatedCart = cart.map(item => {
      if (item.ProductID === productId) {
        return {
          ...item,
          quantity: item.quantity + amount
        };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartTotal(calculateCartTotal(updatedCart));
    changeCart();
  };

  const handleCheckout = (content) => {
    setActiveComponent(content);
    if (!passComponent.includes(content)) {
      setPassComponent([...passComponent, content]);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <a
          onClick={() => setActiveComponent('cart')}
          className={activeComponent === 'cart' || passComponent.includes('cart') ? 'cart-header-active' : 'cart-header-passed '}
        >
          Carrito
        </a>
        <div className="cart-header-separator"></div>
        <a
          onClick={() => passComponent.includes('shipping') && setActiveComponent('shipping')}
          className={activeComponent === 'shipping' || passComponent.includes('shipping') ? 'cart-header-active' : 'cart-header-passed '}
        >
          Envio
        </a>
        <div className="cart-header-separator"></div>
        <a
          onClick={() => passComponent.includes('payment') && setActiveComponent('payment')}
          className={activeComponent === 'payment' || passComponent.includes('payment') ? 'cart-header-active' : 'cart-header-passed '}
        >
          Pago
        </a>
      </div>
      {activeComponent === 'cart' && (
        <>
          <h2>Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <div className="cart-content">
              {cart.map(item => (
                <div className="cart-item" key={item.ProductID}>
                  <Link to={`/product/${item.ProductID}`} className="link-container">
                    <img
                      src={"data:image/png;base64," + item.ImageContent}
                      alt={item.ProductName}
                      className="cart-item-image"
                    />
                    <div className="cart-item-info">
                      <h3>{item.ProductName}</h3>
                      <p>{item.Price} €</p>
                    </div>
                  </Link>
                  <div className="cart-item-actions">
                    {item.quantity === 1 ? (
                      <IconTrash size={20} onClick={() => handleRemoveFromCart(item.ProductID)} />
                    ) : (
                      <div onClick={() => handleQuantityChange(item.ProductID, -1)}> - </div>
                    )}
                    <div>{item.quantity}</div>
                    <div onClick={() => handleQuantityChange(item.ProductID, 1)}> + </div>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                <h3>Total del Carrito: {cartTotal} €</h3>
                <button className="checkout-button" onClick={() => handleCheckout("shipping")}>Tramitar pedido</button>
              </div>
              <Link to="/" className="back-to-shop-link">Volver a la Tienda</Link>
            </div>
          )}
        </>
      )}
      {activeComponent === 'shipping' && (
        <Shipping
          setActiveComponent={(content) => handleCheckout(content)}
          cartTotal={cartTotal}
          cart={cart}
          userData={userData}
          setAddress={setAddressID}

          paymentVisibility={() => handleCheckout('payment')}
        />
      )}
      {activeComponent === 'payment' && (
        <Payment
          setActiveComponent={(content) => handleCheckout(content)}
          cartTotal={cartTotal}
          cart={cart}
          userData={userData}
          AddressID={AddressID}
          changeCart={changeCart}
        />
      )}
    </div>
  );
};

export default Cart;
