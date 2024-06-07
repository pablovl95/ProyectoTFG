import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./css/Orders.css";
import { ClipLoader } from "react-spinners";
import WriteReview from '../components/WriteReview'; // Importar el componente de escritura de opinión

function Orders({ userData }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("recent");
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/v1/orders/${userData.UserID}`);
        const data = await response.json();
        const groupedData = groupOrdersByOrderID(data);
        setGroupedOrders(groupedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Cambiar el estado de carga después de completar la carga de datos
      }
    };
    fetchOrders();
  }, []);
  const handleSortChange = (event) => {
    setSortBy(event.target.value); // Actualizar el tipo de filtro de ordenación al cambiar el valor del selector
  };

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

  function StatusTranslation(status) {
    switch (status) {
      case 'delivered':
        return 'Entregado';
      case 'shipped':
        return 'Enviado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      case 'archived':
        return 'Archivado';
      default:
        return status;
    }
  }
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
        // Actualizar el estado local de los pedidos para reflejar el cambio de estado
        // Esto es opcional y depende de cómo manejes los datos en tu aplicación
      } else {
        console.error(`Error al cancelar el pedido ${orderId}.`);
      }
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
    }
  };
  const handleActionButtonClick = (action, orderId) => {
    console.log(orderId)
    if (action === "Cancelar") {
      const confirmCancel = window.confirm("¿Estás seguro de que quieres cancelar este pedido?");
      if (confirmCancel) {
        cancelOrder(orderId, "cancelled");
      } else {
        console.log("Cancelación de pedido cancelada por el usuario.");
      }
    } else if (action === "Eliminar") {
      const confirmCancel = window.confirm("¿Estás seguro de que quieres eliminar este pedido?");
      if (confirmCancel) {
        cancelOrder(orderId, "deleted");
      } else {
        console.log("Cancelación de pedido eliminar por el usuario.");
      }

    } else if (action === "Archivar") {
      const confirmCancel = window.confirm("¿Estás seguro de que quieres archivar este pedido?");
      if (confirmCancel) {
        cancelOrder(orderId, "archived");
      } else {
        console.log("Cancelación de pedido cancelada por el usuario.");
      }
    }
  };
  const renderOrderButtons = (orderStatus, orderId) => {
    if (orderStatus === "delivered") {
      return (
        <div className="order-actions">
          <div className="order-action-button" onClick={() => { setSelectedOrder(groupedOrders[orderId]); setShowReviewForm(true); }}>Escribir una opinión</div>
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
          <div className="order-action-button">Detalles del pedido</div>
          <div className="order-action-button" onClick={() => handleActionButtonClick("Eliminar")}>Eliminar permanentemente</div>
        </div>
      );
    }
    return null;
  };
  if (loading) {
    return (
      <div style={{ padding: "10rem", paddingBottom: "20rem" }}>
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
      <h2>Mis pedidos</h2>
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
        {Object.entries(groupedOrders)
          .sort((a, b) => {
            // Ordenar los pedidos según el tipo de filtro seleccionado
            if (sortBy === "recent") {
              return new Date(b[1][0].OrderDate) - new Date(a[1][0].OrderDate);
            } else if (sortBy === "oldest") {
              return new Date(a[1][0].OrderDate) - new Date(b[1][0].OrderDate);
            } else if (sortBy === "priceLowToHigh") {
              const totalPriceA = a[1].reduce((acc, curr) => acc + curr.TOTAL, 0);
              const totalPriceB = b[1].reduce((acc, curr) => acc + curr.TOTAL, 0);
              return totalPriceA - totalPriceB;
            }
            return 0;
          }).map(([orderID, orderList]) => {
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
                        <p>{order.TOTAL} €</p>
                      </div>
                      <div className="order-info-subheader">
                        Enviar a:
                        <p>{order.AddressTitle}</p>
                      </div>
                    </div>
                    <div className="order-info-tags-mobile">
                      <div className="order-info-subheader">
                        Pedido realizado:
                        <p>{new Date(order.OrderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="order-info-subheader">
                      <h5>ID: {order.OrderID}</h5>
                      <p>{StatusTranslation(order.OrderStatus)}</p>
                    </div>
                  </div>
                  <div className="order-transport-info">
                    {order.OrderStatus === 'delivered' && <h3>Entregado el {new Date(order.OrderDeliveredDate).toLocaleDateString()} a las {new Date(order.OrderDeliveredDate).getHours()}:{new Date(order.OrderDeliveredDate).getMinutes()}</h3>}
                    {order.OrderStatus === 'delivered' && <a>{order.transportInfo}</a>}
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
                    {renderOrderButtons(order.OrderStatus, orderID)}
                  </div>
                  <div className="separator"></div>
                  <a>Archivar</a>
                </div>
              )
            );
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
