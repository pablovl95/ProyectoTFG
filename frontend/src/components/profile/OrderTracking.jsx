import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/profile/OrderTracking.css';

const OrderTracking = ({ setNotification, userData }) => {
    const { id2 } = useParams();
    const navigate = useNavigate();
    const backendUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : process.env.REACT_APP_BACKEND_URL;

    const [orders, setOrders] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchId, setSearchId] = useState('');

    useEffect(() => {
        setIsLoading(true);
        const fetchOrdersID = async () => {
            setIsLoading(true);
            try {
                const url = `${backendUrl}/api/v1/orders/${userData.UserID}/${id2}`;
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                } else {
                    setError(data.message);
                    setNotification({ message: data.message, type: 'error' });
                }
            } catch (err) {
                console.error('Error fetching order data:', err);
                setError('Error al obtener los datos del pedido. Intente nuevamente más tarde.');
                setNotification({ message: 'Error al obtener los datos del pedido. Intente nuevamente más tarde.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const data = await fetch(`${backendUrl}/api/v1/orders/${userData.UserID}?recents=true`);
                const orders = await data.json();
                setOrders(orders);
                setIsLoading(false);
            }
            catch (err) {
                console.error('Error fetching order data:', err);
                setError('Error al obtener los datos del pedido. Intente nuevamente más tarde.');
                setNotification({ message: 'Error al obtener los datos del pedido. Intente nuevamente más tarde.', type: 'error' });
            }

        }
        if (id2) {
            fetchOrdersID();
        } else {
            fetchOrders();

        }

    }, [id2]);

    function StatusTranslation(status) {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'shipped':
                return 'Enviado';
            case 'delivered':
                return 'Entregado';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status;
        }
    }

    function renderButtonActions(status) {
        switch (status) {
            case 'pending':
                return (
                    <div>
                        <button className="order-tracking-product-action-button">Cancelar</button>
                    </div>
                );
            case 'shipped':
                return (
                    <div>
                        <a>No hay acciones disponibles en este estado</a>
                    </div>
                );
            case 'delivered':
                return (
                    <div>
                        <button className="order-tracking-product-action-button">Calificar</button>
                    </div>
                );
            default:
                return null;
        }
    }

    const handleSearch = async () => {
        if (searchId.trim() === '') {
            setNotification({ message: 'Por favor ingrese un ID válido.', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/v1/orders/${userData.UserID}/${searchId}`);
            const data = await response.json();
            if (response.ok) {
                setOrders([data]);
            } else {
                setError(data.message);
                setNotification({ message: data.message, type: 'error' });
            }
        } catch (err) {
            console.error('Error fetching order data:', err);
            setError('Error al obtener los datos del pedido. Intente nuevamente más tarde.');
            setNotification({ message: 'Error al obtener los datos del pedido. Intente nuevamente más tarde.', type: 'error' });
        }
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="order-tracking-container">
            <h2>Seguimiento de Pedidos</h2>
            {!id2 && (
                <div className="order-tracking-search">
                    <input
                        type="text"
                        placeholder="Ingrese el ID del pedido"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button onClick={handleSearch}>Buscar</button>
                    {orders.length > 0 && !isLoading && (
                        <div className="order-tracking-search-results">
                            <h4>Resultados de la búsqueda</h4>
                            {Object.values(orders).map((order, idx) => {
                                const orderList = order.OrderProducts;
                                return (

                                    <div className="order-tracking-card" key={idx} >
                                        <div className="order-tracking-products-card" onClick={() => { navigate(`/profile/order-tracking/${order.OrderID}`) }}>
                                            <table className="order-tracking-products-table">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <div className='order-tracking-table-column'>
                                                                <a>Pedido realizado</a>
                                                                {new Date(order?.OrderDate).toLocaleDateString()}

                                                            </div></th>
                                                        <th>
                                                            <div className='order-tracking-table-column'><a>
                                                                Total</a>
                                                                {order?.TOTAL}
                                                            </div>
                                                        </th>
                                                        <th>
                                                            <div className='order-tracking-table-column'>
                                                                <a>Enviar a</a>
                                                                {order?.AddressTitle}</div></th>
                                                        <th>
                                                            <div className='order-tracking-table-column'>
                                                                <a>ID</a>
                                                                {order?.OrderID}
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orderList.map((product, idx) => (
                                                        <tr key={idx}>
                                                            <td><h4 style={{ margin: "0" }}>{product.ProductName}</h4></td>
                                                            <td>{product.Price} €</td>
                                                            <td>{product.Quantity}</td>
                                                            <td onClick={() => navigate(`/shops/${product.ShopID}`)}><a style={{ color: "green" }}>{product.ShopName}</a></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                )
                            })}
                        </div>)
                    }
                </div>
            )
            }
            {
                id2 && orders.map(order => {
                    const orderList = order.OrderProducts || [];
                    return (
                        <div key={order.OrderID} className="order-tracking-item">
                            <h3>Pedido #{order.OrderID}</h3>
                            <p>Fecha de pedido: {new Date(order.OrderDate).toLocaleDateString()}</p>
                            <p>Dirección: {order.Address?.[0]?.AddressTitle || 'Sin dirección'}</p>
                            <h4>Productos</h4>
                            <div className="order-tracking-order-products">
                                {
                                    orderList.map(product => (
                                        <div key={product.OrderProductsID} className="order-tracking-product">
                                            <img src={`data:image/jpeg;base64,${product.ImageContent}`} alt={product.ProductName} />
                                            <div className="order-tracking-product-content">
                                                <div className="order-tracking-product-details">
                                                    <div>
                                                        <h4>Detalles del producto</h4>
                                                        <p>Nombre del producto: {product.ProductName}</p>
                                                        <p>Precio: {product.Price}</p>
                                                        <p>Cantidad: {product.Quantity}</p>
                                                        <p>Tienda: {product.ShopName}</p>
                                                    </div>
                                                    <div className='order-tracking-product-actions'>
                                                        <h4>Acciones</h4>
                                                        {renderButtonActions(product?.OrderStatus[product.OrderStatus.length - 1].OrderStatus)}
                                                    </div>
                                                </div>
                                                <h4>Estados del Pedido</h4>
                                                <div className="order-tracking-status-container">
                                                    {Array.isArray(product.OrderStatus) && product.OrderStatus.map(status => (
                                                        <div key={status.OrderStatusID} className="order-tracking-status">
                                                            <p>Estado: {StatusTranslation(status.OrderStatus)}</p>
                                                            <p>Fecha de inicio: {new Date(status.OrderStatusDate).toLocaleDateString()}</p>
                                                            <p>Fecha de fin: {status.OrderStatusFinalDate ? new Date(status.OrderStatusFinalDate).toLocaleDateString() : 'En proceso'}</p>
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )
                })
            }
            {!orders || orders.length === 0 ? <div>No se encontraron pedidos.</div> : null}
        </div >
    );
};

export default OrderTracking;
