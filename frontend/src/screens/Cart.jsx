import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';
import './css/Cart.css'; // Importa el archivo CSS

const Cart = ({changeCart}) => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
      const total = calculateCartTotal(JSON.parse(storedCart));
      setCartTotal(total);
    }
  }, []);

  const calculateCartTotal = (cart) => {
    return cart.reduce((total, item) => total + item.Price * item.quantity, 0).toFixed(3);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.ProductID !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    const total = calculateCartTotal(updatedCart);
    setCartTotal(total);
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
    const total = calculateCartTotal(updatedCart);
    setCartTotal(total);
    changeCart();
  };

  const handleCheckout = () => {
    // Divide cart items by shop
    const dividedOrders = divideOrders(cart);

    // Process the orders as needed
    console.log('User Order:', dividedOrders.userOrder);
    console.log('Shop Orders:', dividedOrders.shopOrders);

    // Optionally, clear the cart
    // localStorage.removeItem('cart');
    // setCart([]);
    // setCartTotal(0);
    // console.log('Compra finalizada');
  };

  const divideOrders = (cartItems) => {
    let result = {
      userOrder: [],
      shopOrders: {}
    };

    cartItems.forEach(product => {
      result.userOrder.push(product);

      if (!result.shopOrders[product.ShopID]) {
        result.shopOrders[product.ShopID] = {
          ShopName: product.ShopName,
          ShopID: product.ShopID,
          Products: []
        };
      }
      result.shopOrders[product.ShopID].Products.push(product);
    });

    return result;
  };

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <div>
          {cart.map(item => (
            <div className="cart-item" key={item.ProductID}>
              <Link to={`/product/${item.ProductID}`} className='link-container'>
                <img src={item.ProductImages.slice(1, -1).split(',')[0]?.trim()} alt={item.ProductName} className="cart-item-image" />
                <div className="cart-item-info">
                  <h3>{item.ProductName}</h3>
                  <p>{item.Price} €</p>
                </div>
              </Link>
              <div className="cart-item-actions">
                {item.quantity === 1 ?
                  <IconTrash size={20} onClick={() => handleRemoveFromCart(item.ProductID)} /> :
                  <div onClick={() => handleQuantityChange(item.ProductID, -1)}> - </div>}
                <div>{item.quantity}</div>
                <div onClick={() => handleQuantityChange(item.ProductID, 1)}> + </div>
              </div>
            </div>
          ))}
          <Link to="/" className="back-to-shop-link">Volver a la Tienda</Link>
          <div className="cart-total">
            <h3>Total del Carrito: ${cartTotal}</h3>
            <button className="checkout-button" onClick={handleCheckout}>Finalizar Compra</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;
