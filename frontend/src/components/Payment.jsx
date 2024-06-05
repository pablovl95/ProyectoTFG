import React from 'react';

const Payment = ({ setActiveComponent, user, cartTotal}) => {
    const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

    function separateProductsByShop() {
        const productsByShop = {};
        const products = JSON.parse(localStorage.getItem('cart'));
        products.forEach(product => {
            const shopId = product.ShopID;
            const productInfo = {
                ProductID: product.ProductID,
                Quantity: product.quantity
            };

            if (productsByShop.hasOwnProperty(shopId)) {
                productsByShop[shopId].push(productInfo);
            } else {
                productsByShop[shopId] = [productInfo];
            }
        });

        return productsByShop;
    }

    const handleCheckout = () => {
        const productsByShop = separateProductsByShop();
        console.log(productsByShop);
        // const orderData = {
        //     UserID: user.uid,
        //     Total: cartTotal,
        //     OrderStatus: 'pending'
        // };

        // fetch(`${backendUrl}/api/v1/orders`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(orderData)
        // }).then(response => {
        //     if (response.ok) {
        //         return response.json();
        //     } else {
        //         throw new Error('Error al crear la orden');
        //     }
        // }).then(order => {
        //     // Ahora que tenemos el ID de la orden, creamos los registros de productos
        //     const productPromises = [];
        //     for (const shopId in productsByShop) {
        //         const products = productsByShop[shopId];
        //         const productData = {
        //             ShopID: shopId,
        //             Products: products.map(product => ({
        //                 ProductID: product.ProductID,
        //                 Quantity: product.Quantity
        //             })),
        //             OrderID: order.OrderID,
        //             AddressID: order.AddressID,
        //             AddressStatus: 'pending'
        //         };

        //         productPromises.push(fetch(`${backendUrl}/api/v1/order-products`, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify(productData)
        //         }));
        //     }

        //     // Esperamos a que todas las promesas de productos se completen antes de continuar
        //     return Promise.all(productPromises);
        // }).then(() => {
        //     // Si todos los productos se crearon correctamente, limpiamos el carrito y redirigimos
        //     localStorage.removeItem('cart');
        //     setActiveComponent('orders');
        // }).catch(error => {
        //     console.error(error);
        //     // Manejar el error de alguna manera
        // });
    };

    return (
        <div className="payment-container">
            <h2>Información de Pago</h2>
            {/* Aquí puedes añadir el formulario o la información de pago */}
            <button onClick={() => setActiveComponent('shipping')}>Volver a Envío</button>
            <button onClick={handleCheckout}>Finalizar Compra</button>
        </div>
    );
};

export default Payment;
