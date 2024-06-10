import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./css/Orders.css";
import { ClipLoader } from "react-spinners";
import WriteReview from './WriteReview'; 
import { StatusTranslation } from '../utils/utils';

function Orders({ userData, recents }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("recent");
  const [OrdersData, setOrdersData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ss = recents ? "?recents=true" : "";
        const response = await fetch(`${backendUrl}/api/v1/orders/${userData.UserID}` + ss);
        const data = await response.json();
        setOrdersData(data);

      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Cambiar el estado de carga después de completar la carga de datos
      }
    };
    fetchOrders();

  }, []);

  const handleSortChange = (event) => {
    const selectedSortOption = event.target.value;
    let sortedOrders = {};

    if (selectedSortOption === "recent") {
      sortedOrders = Object.values(OrdersData).sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));
    } else if (selectedSortOption === "oldest") {
      sortedOrders = Object.values(OrdersData).sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
    } else if (selectedSortOption === "priceLowToHigh") {
      sortedOrders = Object.values(OrdersData).sort((a, b) => a.TOTAL - b.TOTAL);
    }

    setOrdersData(sortedOrders);
    setSortBy(selectedSortOption);
  };


  const [filter, setFilter] = useState("all");

  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
  };
  const shouldShowOrder = (order) => {
    if (filter === "archived") {
      return order?.OrderStatus === "archived";
    } else if (filter === "all") {
      return order?.OrderStatus !== "archived";
    } else {
      return order?.OrderStatus === filter;
    }
  };
  

  const handleCardClick = (orderId) => {
    navigate(`/profile/my-orders/${orderId}`);
  };
  const cancelOrder = async (orderId, status) => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ OrderStatus: status })
      });
      if (response.ok) {
        console.log(`Pedido ${orderId} cancelado exitosamente.`);
      } else {
        console.error(`Error al cancelar el pedido ${orderId}.`);
      }
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
    }
  };
  const handleActionButtonClick = (action, orderId, idx) => {
    if (action === "Cancelar") {
      const confirmCancel = window.confirm("¿Estás seguro de que quieres cancelar este pedido?");
      if (confirmCancel) {
        cancelOrder(orderId, "cancelled");
        window.location.reload();
      } else {
        console.log("Cancelación de pedido cancelada por el usuario.");
      }
    } else if (action === "Eliminar") {
      const confirmCancel = window.confirm("¿Estás seguro de que quieres eliminar este pedido?");
      if (confirmCancel) {
        cancelOrder(orderId, "deleted");
        window.location.reload();
      } else {
        console.log("Cancelación de pedido eliminar por el usuario.");
      }

    } else if (action === "Archivar") {
      const confirmCancel = window.confirm("¿Estás seguro de que quieres archivar este pedido?");
      if (confirmCancel) {
        cancelOrder(orderId, "archived");
        window.location.reload();
      } else {
        console.log("Cancelación de pedido cancelada por el usuario.");
      }
    }
  };
  const renderOrderButtons = (orderStatus, orderId, idx) => {
    if (orderStatus === "delivered") {
      return (
        <div className="order-actions">
          {/* <div className="order-action-button" onClick={() => { setSelectedOrder(OrdersData[idx]); setShowReviewForm(true); }}>Escribir una opinión</div> */}
          <div className="order-action-button" onClick={async () => { setSelectedOrder(OrdersData[idx]); setShowReviewForm(true); }}>Escribir una opinión</div>
          <div className="order-action-button" onClick={() => handleCardClick(orderId)}>Detalles del pedido</div>
        </div>
      );
    }
    if (orderStatus === "shipped") {
      return (
        <div className="order-actions">
          <div className="order-action-button">Localiza tu paquete</div>
          <div className="order-action-button" onClick={() => handleCardClick(orderId)}>Detalles del pedido</div>
        </div>
      );
    }
    if (orderStatus === "pending") {
      return (
        <div className="order-actions">
          <div className="order-action-button" onClick={() => handleActionButtonClick("Cancelar", orderId)}>Cancelar pedido</div>
          <div className="order-action-button" onClick={() => handleCardClick(orderId)}>Detalles del pedido</div>
          <div className="order-action-button">Cambiar dirección de envío</div>
        </div>
      );
    }
    if (orderStatus === "cancelled") {
      return (
        <div className="order-actions">
          <div className="order-action-button" onClick={() => handleActionButtonClick("Eliminar", orderId)}>Eliminar pedido</div>
          <div className="order-action-button" onClick={() => handleCardClick(orderId)}>Detalles del pedido</div>
          <div className="order-action-button">Contactar soporte</div>
        </div>
      );
    }
    if (orderStatus === "archived") {
      return (
        <div className="order-actions">
          <div className="order-action-button">Restaurar pedido</div>
          <div className="order-action-button" onClick={() => handleCardClick(orderId)}>Detalles del pedido</div>
          <div className="order-action-button" onClick={() => handleActionButtonClick("Eliminar", orderId)}>Eliminar permanentemente</div>
        </div>
      );
    }
    return null;
  };
  if (loading) {
    return (
      <div style={{ padding: "10rem", paddingBottom: "20rem", width: "10%", margin: "auto" }}>
        <ClipLoader
          color={"green"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="orders-container">

      <div className="orders-header">
        <a className={filter === "all" ? "active" : ""} onClick={() => handleFilterClick("all")}>Todos</a>
        <a className={filter === "delivered" ? "active" : ""} onClick={() => handleFilterClick("delivered")}>Completados</a>
        <a className={filter === "shipped" ? "active" : ""} onClick={() => handleFilterClick("shipped")}>Enviados</a>
        <a className={filter === "pending" ? "active" : ""} onClick={() => handleFilterClick("pending")}>Pendientes</a>
        <a className={filter === "cancelled" ? "active" : ""} onClick={() => handleFilterClick("cancelled")}>Cancelados</a>
        <a className={filter === "archived" ? "active" : ""} onClick={() => handleFilterClick("archived")}>Archivados</a>
      </div>
      <select value={sortBy} onChange={handleSortChange}>
        <option value="recent">Más reciente</option>
        <option value="oldest">Más antiguo</option>
        <option value="priceLowToHigh">Precio de menor a mayor</option>
      </select>
      <div className="orders-list">
        {Object.values(OrdersData).map((order, idx) => {
          const orderID = order.OrderID;
          const orderList = order.OrderProducts;

          return shouldShowOrder(order) && (

            <div className="order-card" key={idx}>
              <div className="order-info-header">
                <div className="order-info-tags">
                  <div className="order-info-subheader">
                    Pedido realizado:
                    <p>{new Date(order?.OrderDate).toLocaleDateString()}</p>
                  </div>
                  <div className="order-info-subheader">
                    Total:
                    <p>{order?.TOTAL} €</p>
                  </div>
                  <div className="order-info-subheader">
                    Enviar a:
                    <p>{order?.AddressTitle}</p>
                  </div>
                </div>
                <div className="order-info-tags-mobile">
                  <div className="order-info-subheader">
                    Pedido realizado:
                    <p>{new Date(order?.OrderDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="order-info-subheader">
                  <h5>ID: {order?.OrderID}</h5>
                  <p>{StatusTranslation(order?.OrderStatus)}</p>
                </div>
              </div>
              <div className="order-transport-info">
                {order?.OrderStatus === 'delivered' && <h3>Entregado el {new Date(order?.OrderDeliveredDate).toLocaleDateString()} a las {new Date(order?.OrderDeliveredDate).getHours()}:{new Date(order?.OrderDeliveredDate).getMinutes()}</h3>}
                {order?.OrderStatus === 'delivered' && <a>{order?.transportInfo}</a>}
              </div>
              <div className="order-info-details">
                <div className="order-products">
                  {orderList.map(product => (
                    <div key={product.ProductID} className="order-product-item">
                      <img src={`data:image/jpeg;base64,${product.ImageContent}`} alt={product.ProductName} className="order-product-image" />
                      <div className="order-product-details">
                        <p>{
                          product.ProductName}</p>
                        <p>Cantidad: {product.Quantity}</p>
                        <div className='order-buy-button'>Comprarlo de nuevo</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-detail-mobile" onClick={() => handleCardClick(orderID)}>
                  {">"}
                </div>
                {renderOrderButtons(order?.OrderStatus, orderID, idx)}
              </div>

              {order.OrderStatus != "archived" ?
                <div className='order-card-archive-button'>
                  <div className="separator"></div>
                  <a onClick={() => handleActionButtonClick("Archivar", order?.OrderID)}>Archivar</a>
                </div>
                : null}
            </div>

          )
        })}
      </div>
      {showReviewForm && (
        <WriteReview
          order={selectedOrder}
          userData={userData}
          onClose={() => {
            setShowReviewForm(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>

  );
}

export default Orders;
