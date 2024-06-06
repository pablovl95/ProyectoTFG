import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./css/Orders.css";

function Orders() {
  const navigate = useNavigate();
  const [ordersv2, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL;
  
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`${backendUrl}/api/v1/orders/iS3FZuqtKYYs12UmGaZYcL2dgqj1`);
      const data = await response.json();
      const groupedData = groupOrdersByOrderID(data);
      setGroupedOrders(groupedData);
      console.log(groupedData);
    };
    fetchOrders();
  }, []);

  function groupOrdersByOrderID(orders) {
    return orders.reduce((groupedOrders, order) => {
      const { OrderID } = order;
      if (!groupedOrders[OrderID]) {
        groupedOrders[OrderID] = [];
      }
      groupedOrders[OrderID].push(order);
      return groupedOrders;
    }, {});
  }
  const orders = [
    {
      OrderID: "a1b2c3",
      UserID: "user123",
      ShopID: "shop456",
      AddressID: "address789",
      OrderDate: "2024-06-04 12:00:00",
      Total: 100,
      AddressTitle: "Casa",
      OrderStatus: "pending",
      transportInfo: "",
      Products: [
        { ProductID: "product1", Name: "Product 1", Quantity: 2, ImageDefault: "/apple.jpg" },
        { ProductID: "product2", Name: "Product 2", Quantity: 1, ImageDefault: "/apple.jpg" }
      ]
    },
    {
      OrderID: "adasdsada",
      UserID: "user123",
      ShopID: "shop456",
      AddressID: "address789",
      OrderDate: "2024-06-04 12:00:00",
      Total: 100,
      AddressTitle: "Casa",
      OrderStatus: "completed",
      transportInfo: "El paquete se ha dejado en la puerta de su casa",
      DeliveryDate: "2024-06-04 12:00:00",
      Products: [
        { ProductID: "product1", Name: "Product 1", Quantity: 2, ImageDefault: "/apple.jpg" },
        { ProductID: "product2", Name: "Product 2", Quantity: 1, ImageDefault: "/apple.jpg" }
      ]
    },
    {
      OrderID: "x9y8z7",
      UserID: "user456",
      ShopID: "shop789",
      AddressID: "address123",
      OrderDate: "2024-06-05 10:30:00",
      AddressTitle: "Trabajo",
      Total: 120,
      OrderStatus: "shipped",
      transportInfo: "",
      Products: [
        { ProductID: "product3", Name: "Product 3", Quantity: 3, ImageDefault: "/apple.jpg" },
        { ProductID: "product4", Name: "Product 4", Quantity: 1, ImageDefault: "/apple.jpg" },
        { ProductID: "product2", Name: "Product 2", Quantity: 3, ImageDefault: "/apple.jpg" },
        { ProductID: "product1", Name: "Product 1", Quantity: 1, ImageDefault: "/apple.jpg" }
      ]
    }
  ];

  const [filter, setFilter] = useState("all");

  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
  };
  const shouldShowOrder = (order) => {
    if (filter === "all") {
      return true;
    } else {
      return order.OrderStatus === filter;
    }
  };

  const handleCardClick = (orderId) => {
    navigate(`/profile/orders/${orderId}`);
  };

  const renderOrderButtons = (orderStatus) => {
    if (orderStatus === "completed") {
      return (
        <div className="order-actions">
          <div className="order-action-button">Escribir una opinión</div>
          <div className="order-action-button">Detalles del pedido</div>
        </div>
      );
    }
    if (orderStatus === "shipped") {
      return (
        <div className="order-actions">
          <div className="order-action-button">Localiza tu paquete</div>
          <div className="order-action-button">Detalles del pedido</div>
        </div>
      );
    }
    if (orderStatus === "pending") {
      return (
        <div className="order-actions">
          <div className="order-action-button">Localiza tu paquete</div>
          <div className="order-action-button">Detalles del pedido</div>
          <div className="order-action-button">Cancelar pedido</div>
          <div className="order-action-button">Cambiar dirección de envío</div>
        </div>
      );
    }
    if (orderStatus === "cancelled") {
      return (
        <div className="order-actions">
          <div className="order-action-button">Eliminar pedido</div>
          <div className="order-action-button">Detalles del pedido</div>
          <div className="order-action-button">Contactar soporte</div>
        </div>
      );
    }
    if (orderStatus === "archived") {
      return (
        <div className="order-actions">
          <div className="order-action-button">Restaurar pedido</div>
          <div className="order-action-button">Detalles del pedido</div>
          <div className="order-action-button">Eliminar permanentemente</div>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="orders-container">
      <h2>Mis pedidos</h2>
      <div className="orders-header">
        <a className={filter === "all" ? "active" : ""} onClick={() => handleFilterClick("all")}>Todos</a>
        <a className={filter === "completed" ? "active" : ""} onClick={() => handleFilterClick("completed")}>Completados</a>
        <a className={filter === "shipped" ? "active" : ""} onClick={() => handleFilterClick("shipped")}>Enviados</a>
        <a className={filter === "pending" ? "active" : ""} onClick={() => handleFilterClick("pending")}>Pendientes</a>
        <a className={filter === "cancelled" ? "active" : ""} onClick={() => handleFilterClick("cancelled")}>Cancelados</a>
        <a className={filter === "archived" ? "active" : ""} onClick={() => handleFilterClick("archived")}>Archivados</a>
      </div>
      <div className="orders-list">
        {Object.entries(groupedOrders).map(([orderID, orderList]) => {
          const order = orderList[0]; // Assuming all items in orderList have the same order details except for product specifics

          return (
            shouldShowOrder(order) && (
              <div className="order-card" key={orderID}>
                <div className="order-info-header">
                  <div className="order-info-tags">
                    <div className="order-info-subheader">
                      Pedido realizado:
                      <p>{new Date(order.OrderDate).toLocaleDateString()}</p>
                    </div>
                    <div className="order-info-subheader">
                      Total:
                      <p>{order.Total} €</p>
                    </div>
                    <div className="order-info-subheader">
                      Enviar a:
                      <p>{order.AddressTitle}</p>
                    </div>
                  </div>
                  <div className="order-info-subheader">
                    <h5>ID: {order.OrderID}</h5>
                    <p>{order.OrderStatus}</p>
                  </div>
                </div>
                <div className="order-transport-info">
                  {order.OrderStatus === 'completed' && <h3>Entregado el: {new Date(order.DeliveryDate).toLocaleDateString()}</h3>}
                  {order.OrderStatus === 'completed' && <a>{order.transportInfo}</a>}
                </div>
                <div className="order-info-details">
                  <div className="order-products">
                    {orderList.map(product => (
                      <div key={product.ProductID} className="order-product-item">
                        <img src={`data:image/jpeg;base64,${product.ImageContent}`} alt={product.ProductName} className="order-product-image" />
                        <div className="order-product-details">
                          <p>{product.ProductName}</p>
                          <p>Cantidad: {product.Quantity}</p>
                          <div className='order-buy-button'>Comprarlo de nuevo</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-detail-mobile">
                    {">"}
                  </div>
                  {renderOrderButtons(order.OrderStatus)}
                </div>
                <div className="separator"></div>
                <a>Archivar</a>
              </div>
            )
          );
        })}


      </div>
    </div>
  );
}

export default Orders;
