import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Payment = ({ setActiveComponent, userData, cartTotal, AddressID, changeCart }) => {
    const navigate = useNavigate();
    const backendUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        // console.log(AddressID);
        //console.log(userData);
    }, [AddressID]);
    const handleCheckout = () => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const datav2 = cart.map((item) => {
            return {
                ProductID: item.ProductID,
                ShopID: item.ShopID,
                AddressID: AddressID,
                Quantity: item.quantity,
            };
        });
        const datav1 = {
            UserID: userData.UserID,
            AddressID: AddressID,
            OrderDate: new Date().toISOString(),
            TOTAL: cartTotal,
            Products: JSON.stringify(datav2),
        }

        fetch(`${backendUrl}/api/v1/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datav1),
        })
            .then((response) => {
                if (response.ok) {
                    // Parseamos la respuesta como JSON y devolvemos la promesa
                    return response.json();
                } else {
                    console.error('Failed to create order');
                    throw new Error('Failed to create order');
                }
            })
            .then(async () => {
                localStorage.removeItem('cart');
                changeCart();
                navigate('/profile/orders');
            })
            .catch((error) => {
                console.error('Error:', error);
            });


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
