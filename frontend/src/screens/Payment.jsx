import React, { useState } from 'react';
import "./css/Payment.css";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { IconCirclePlus } from '@tabler/icons-react';

const Payment = () => {
    const [paymentMethods, setPaymentMethods] = useState([
        {
            id: "asdk",
            type: "creditCard",
            label: "Tarjeta de crédito",
            number: "1234 5678 1234 5678",
            expiry: "12/23",
            cvc: "123",
            name: "John Doe"
        },
        {
            id: "ades",
            type: "creditCard",
            label: "Tarjeta de crédito",
            number: "1234 5678 1234 5678",
            expiry: "12/23",
            cvc: "123",
            name: "John Doe"
        },
        {
            id: "sdadsa",
            type: "paypal",
            label: "PayPal",
            email: "example@example.com"
        },
        {
            id: "adsfsas",
            type: "debitCard",
            label: "Tarjeta de débito",
            number: "4321 8765 4321 8765",
            expiry: "10/25",
            cvc: "456",
            name: "Jane Doe"
        },
        {
            type: "bizum",
            label: "Bizum",
            phoneNumber: "123456789"
        }
    ]);
    const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0] || "null");
    const handlePaymentSelection = (method) => {
        setSelectedPayment(method);
    };

    return (
        <div className="payment-container">
            <h1>Cartera</h1>
            <div className="payment-content">
                <div className="payment-selector">
                    <div className="payment-methods-list">
                        <h2>Tarjetas y cuentas</h2>
                        {paymentMethods.map(method => (
                            <div
                                key={method.type}
                                className={`payment-method ${selectedPayment === method ? 'selected' : ''}`}
                                onClick={() => handlePaymentSelection(method)}
                            >
                                <p>{method.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className='payment-method'>
                        <p>Agregar método de pago</p>
                        <IconCirclePlus color='green' />
                    </div>
                </div>
                <div className="payment-details">
                    {selectedPayment && (
                        <>
                            <h2>{selectedPayment.label}</h2>
                            {selectedPayment.type === 'creditCard' && (
                                <Cards
                                    cvc={selectedPayment.cvc}
                                    expiry={selectedPayment.expiry}
                                    focused="number"
                                    name={selectedPayment.name}
                                    number={selectedPayment.number}
                                />
                            )}
                            {selectedPayment.type === 'paypal' && (
                                <>
                                    <p>Paypal</p>
                                    <p>{selectedPayment.email}</p>
                                </>
                            )}
                            {selectedPayment.type === 'debitCard' && (
                                <Cards
                                    cvc={selectedPayment.cvc}
                                    expiry={selectedPayment.expiry}
                                    focused="number"
                                    name={selectedPayment.name}
                                    number={selectedPayment.number}
                                />
                            )}
                            {selectedPayment.type === 'bizum' && (
                                <>
                                    <p>Bizum</p>
                                    <p>{selectedPayment.phoneNumber}</p>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;
