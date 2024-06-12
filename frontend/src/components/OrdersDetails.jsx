import React, { useEffect, useState } from 'react';
import "./css/OrdersDetails.css";
import { StatusTranslation } from '../utils/utils';

function DetallesPedido({ userData, id }) {
  const [detallesPedido, setDetallesPedido] = useState(null);
  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/v1/orders/${userData.UserID}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data);
        setDetallesPedido(data[0]); // Suponemos que la API devuelve un array con un pedido
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
      }
    };
    fetchData();
  }, [id, userData.UserID, backendUrl]);

  if (!detallesPedido) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="order-details-container">
      <div className="order-details-order">
        <h3>Resumen del Pedido</h3>
        <table className="order-details-table-summary">
          <tbody>
            <tr>
              <th>ID del Pedido:</th>
              <td>{detallesPedido.OrderID}</td>
            </tr>
            <tr>
              <th>Fecha de realización del pedido:</th>
              <td>{new Date(detallesPedido.OrderDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Fecha de entrega:</th>
              <td>{new Date(detallesPedido.OrderDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Estado del pedido:</th>
              <td>{StatusTranslation(detallesPedido.OrderStatus)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="order-details-delivered-address">
        <h3>Dirección de Entrega</h3>
        <table className="order-details-table-address">
          <tbody>
            <tr>
              <th>Nombre Completo:</th>
              <td>{`${detallesPedido.Address[0].FirstName} ${detallesPedido.Address[0].LastName}`}</td>
            </tr>
            <tr>
              <th>Teléfono:</th>
              <td>{detallesPedido.Address[0].Phone}</td>
            </tr>
            <tr>
              <th>Título de la Dirección:</th>
              <td>{detallesPedido.Address[0].AddressTitle}</td>
            </tr>
            <tr>
              <th>Dirección:</th>
              <td>{`${detallesPedido.Address[0].AddressLine}, ${detallesPedido.Address[0].AddressNumber}`}</td>
            </tr>
            <tr>
              <th>Código Postal:</th>
              <td>{detallesPedido.Address[0].PostalCode}</td>
            </tr>
            <tr>
              <th>Ciudad:</th>
              <td>{detallesPedido.Address[0].City}</td>
            </tr>
            <tr>
              <th>Provincia:</th>
              <td>{detallesPedido.Address[0].Province}</td>
            </tr>
            <tr>
              <th>País:</th>
              <td>{detallesPedido.Address[0].Country}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="order-details-actions">
        {detallesPedido.OrderStatus === 'pending' && (
          <>
          <button className="order-details-cancel-button">Cancelar Pedido</button>
          <button className="order-details-change-button">Cambiar Dirección de envio</button>
          </>
        )}
        {detallesPedido.OrderStatus === 'shipped' && (
          <button className="order-details-tracking-button">Seguimiento del pedido</button>
        )}
        {detallesPedido.OrderStatus === 'delivered' && (
          <button className="order-details-review-button">Valorar Pedido</button>
        )}
      </div>

      <div className="order-details-products">
        <h3>Productos en este Pedido</h3>
        <table className="order-details-table-product">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Tienda</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {detallesPedido.OrderProducts.map(producto => (
              <tr key={producto?.ProductID}>
                <td>
                  <img className="order-details-image" src={`data:image/png;base64,${producto?.ImageContent}`} alt={producto?.ProductName} />
                </td>
                <td>{producto?.ProductName}</td>
                <td>{producto?.ShopName}</td>
                <td>{producto?.Quantity}</td>
                <td>${producto?.Price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetallesPedido;
