// import React, { useState } from 'react';
// import "./css/Payment.css";
// import Cards from 'react-credit-cards-2';
// import 'react-credit-cards-2/dist/es/styles-compiled.css';
// import { IconCirclePlus } from '@tabler/icons-react';

// const Payment = () => {
//     const [paymentMethods, setPaymentMethods] = useState([
//         {
//             id: "asdk",
//             type: "creditCard",
//             label: "Tarjeta de crédito",
//             number: "1234 5678 1234 5678",
//             expiry: "12/23",
//             cvc: "123",
//             name: "John Doe"
//         },
//         {
//             id: "ades",
//             type: "creditCard",
//             label: "Tarjeta de crédito",
//             number: "1234 5678 1234 5678",
//             expiry: "12/23",
//             cvc: "123",
//             name: "John Doe"
//         },
//         {
//             id: "sdadsa",
//             type: "paypal",
//             label: "PayPal",
//             email: "example@example.com"
//         },
//         {
//             id: "adsfsas",
//             type: "debitCard",
//             label: "Tarjeta de débito",
//             number: "4321 8765 4321 8765",
//             expiry: "10/25",
//             cvc: "456",
//             name: "Jane Doe"
//         },
//         {
//             type: "bizum",
//             label: "Bizum",
//             phoneNumber: "123456789"
//         }
//     ]);
//     const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0] || "null");
//     const handlePaymentSelection = (method) => {
//         setSelectedPayment(method);
//     };

//     return (
//         <div className="payment-container">
//             <h1>Cartera</h1>
//             <div className="payment-content">
//                 <div className="payment-selector">
//                     <div className="payment-methods-list">
//                         <h2>Tarjetas y cuentas</h2>
//                         {paymentMethods.map(method => (
//                             <div
//                                 key={method.type}
//                                 className={`payment-method ${selectedPayment === method ? 'selected' : ''}`}
//                                 onClick={() => handlePaymentSelection(method)}
//                             >
//                                 <p>{method.label}</p>
//                             </div>
//                         ))}
//                     </div>
//                     <div className='payment-method'>
//                         <p>Agregar método de pago</p>
//                         <IconCirclePlus color='green' />
//                     </div>
//                 </div>
//                 <div className="payment-details">
//                     {selectedPayment && (
//                         <>
//                             <h2>{selectedPayment.label}</h2>
//                             {selectedPayment.type === 'creditCard' && (
//                                 <Cards
//                                     cvc={selectedPayment.cvc}
//                                     expiry={selectedPayment.expiry}
//                                     focused="number"
//                                     name={selectedPayment.name}
//                                     number={selectedPayment.number}
//                                 />
//                             )}
//                             {selectedPayment.type === 'paypal' && (
//                                 <>
//                                     <p>Paypal</p>
//                                     <p>{selectedPayment.email}</p>
//                                 </>
//                             )}
//                             {selectedPayment.type === 'debitCard' && (
//                                 <Cards
//                                     cvc={selectedPayment.cvc}
//                                     expiry={selectedPayment.expiry}
//                                     focused="number"
//                                     name={selectedPayment.name}
//                                     number={selectedPayment.number}
//                                 />
//                             )}
//                             {selectedPayment.type === 'bizum' && (
//                                 <>
//                                     <p>Bizum</p>
//                                     <p>{selectedPayment.phoneNumber}</p>
//                                 </>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Payment;
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Payment = ({ setActiveComponent, userData, cartTotal, AddressID, changeCart }) => {
    const navigate = useNavigate();
    const backendUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        console.log("ahora si",AddressID);
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
                navigate('/profile/mis-pedidos');
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