import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./css/Orders.css";

function Orders() {
  const navigate = useNavigate();

  // Datos estáticos de ejemplo para mostrar en las cards
  const orders = [
    {
      OrderID: "a1b2c3",
      UserID: "user123",
      ShopID: "shop456",
      AddressID: "address789",
      OrderDate: "2024-06-04 12:00:00",
      OrderStatus: "pending",
      Products: [
        { ProductID: "product1", Name: "Product 1", Quantity: 2, ImageDefault: "/apple.jpg" },
        { ProductID: "product2", Name: "Product 2", Quantity: 1, ImageDefault: "/apple.jpg" }
      ]
    },
    // Agregar más pedidos aquí
    {
      OrderID: "x9y8z7",
      UserID: "user456",
      ShopName: "shop789",
      AddressID: "address123",
      OrderDate: "2024-06-05 10:30:00",
      OrderStatus: "shipped",
      Products: [
        { ProductID: "product3", Name: "Product 3", Quantity: 3, ImageDefault: "/apple.jpg" },
        { ProductID: "product4", Name: "Product 4", Quantity: 1, ImageDefault: "/apple.jpg" },
        { ProductID: "product2", Name: "Product 2", Quantity: 3, ImageDefault: "/apple.jpg" },
        { ProductID: "product1", Name: "Product 1", Quantity: 1, ImageDefault: "/apple.jpg" }
      ]
    }
  ];

  // Estado para rastrear el filtro seleccionado
  const [filter, setFilter] = useState("all");

  // Función para manejar el clic en el filtro
  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
  };

  // Función para verificar si un pedido debe mostrarse según el filtro seleccionado
  const shouldShowOrder = (order) => {
    if (filter === "all") {
      return true;
    } else {
      return order.OrderStatus === filter;
    }
  };

  // Función para manejar el clic en una card de pedido
  const handleCardClick = (orderId) => {
    // Redirige a la página de perfil de pedidos con el ID del pedido
    navigate(`/profile/orders/${orderId}`);
  };

  return (
    <div className="orders-container">
      <h2>Mis pedidos</h2>
      <div className="orders-header">
        <a onClick={() => handleFilterClick("all")}>Pedidos</a>
        <a onClick={() => handleFilterClick("completed")}>Pedidos completados</a>
        <a onClick={() => handleFilterClick("shipped")}>Pedidos enviados</a>
        <a onClick={() => handleFilterClick("pending")}>Pedidos pendientes de envio</a>
        <a onClick={() => handleFilterClick("cancelled")}>Pedidos cancelados</a>
        <a onClick={() => handleFilterClick("archived")}>Pedidos archivados</a>
      </div>
      <div className="orders-container">
        {orders.map(order => (
          shouldShowOrder(order) && (
            <div className="order-card" key={order.OrderID} onClick={() => handleCardClick(order.OrderID)}>
              <h3>ID del pedido:{order.OrderID}</h3>
              <p>{order.ShopID}</p>
              <p>Address ID: {order.AddressID}</p>
              <p>Order Date: {order.OrderDate}</p>
              <p>Order Status: {order.OrderStatus}</p>
              <p>Products:</p>
              <ul>
                {order.Products.map(product => (
                  <li key={product.ProductID}>
                    {product.Name} - Quantity: {product.Quantity}
                  </li>
                ))}
              </ul>
              <div className="order-image-container">
                {order.Products.map((product, index) => (
                  <img
                    key={product.ProductID}
                    className={`order-image ${index === 0 ? 'active' : ''}`}
                    src={product.ImageDefault}
                    alt={product.Name}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default Orders;
