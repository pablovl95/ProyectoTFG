import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./css/OrdersDetails.css";

function OrdersDetails({userData}) {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/v1/orderDetails/${userData.UserID}/${id}`);
        const data = await response.json();
        console.log(data);
        setOrderDetails(data[0]); // Assuming data is an array and you want the first element
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };
    fetchOrderDetails();
  }, [id, userData.UserID, backendUrl]);

  if (!orderDetails) {
    return <div>Cargando detalles del pedido...</div>;
  }

  return (
    <div className="order-details-container">
      <h2>Detalles del Pedido</h2>
      <div className="order-details">
        <div className="order-info">
          <div className="order-info-header">
            <div className="order-info-subheader">
              Pedido realizado el:
              <p>{new Date(orderDetails.OrderDate).toLocaleDateString()}</p>
            </div>
            <div className="order-info-subheader">
              Total:
              <p>{orderDetails.Total} €</p>
            </div>
            <div className="order-info-subheader">
              Enviar a:
              <p>{orderDetails.AddressTitle}</p>
            </div>
            <div className="order-info-subheader">
              Estado:
              <p>{orderDetails.OrderStatus}</p>
            </div>
          </div>
          <div className="order-products">
            <div key={orderDetails.ProductID} className="order-product-item">
              <img src={`data:image/jpeg;base64,${orderDetails.ImageContent}`} alt={orderDetails.ProductName} className="order-product-image" />
              <div className="order-product-details">
                <p>{orderDetails.ProductName}</p>
                <p>Cantidad: {orderDetails.Quantity}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="order-actions">
          {/* Aquí puedes agregar botones de acción según el estado del pedido */}
        </div>
      </div>
    </div>
  );
}

export default OrdersDetails;
