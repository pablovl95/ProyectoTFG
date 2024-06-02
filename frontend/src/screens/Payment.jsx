import React, { useState } from 'react';
import "./css/Payment.css";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const Payment = () => {
    const [selectedPayment, setSelectedPayment] = useState('creditCard');
    const [paymentMethods, setPaymentMethods] = useState([
        {
            type: 'creditCard',
            label: 'Tarjeta de crédito',
            number: '1234 5678 1234 5678',
            expiry: '12/23',
            cvc: '123',
            name: 'John Doe'
        },
        {
            type: 'paypal',
            label: 'PayPal',
            email: 'example@example.com'
        }
    ]);

    const [newPayment, setNewPayment] = useState({
        type: 'creditCard',
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    };

    const handleInputChange = (evt) => {
        const { name, value } = evt.target;
        setNewPayment((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddPayment = () => {
        setPaymentMethods((prevMethods) => [...prevMethods, newPayment]);
        setNewPayment({
            type: 'creditCard',
            number: '',
            expiry: '',
            cvc: '',
            name: ''
        });
    };

    const renderPaymentForm = () => {
        if (!newPayment.type) return null;

        switch (newPayment.type) {
            case 'creditCard':
                return (
                    <div className="payment-form">
                        <form>
                            <div className="form-row">
                                <label htmlFor="number">Número de tarjeta</label>
                                <input type="text" id="number" name="number" value={newPayment.number} onChange={handleInputChange} required />
                            </div>
                            <div className="form-row">
                                <label htmlFor="name">Nombre</label>
                                <input type="text" id="name" name="name" value={newPayment.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-row">
                                <label htmlFor="expiry">Fecha de expiración</label>
                                <input type="text" id="expiry" name="expiry" value={newPayment.expiry} onChange={handleInputChange} required />
                            </div>
                            <div className="form-row">
                                <label htmlFor="cvc">CVC</label>
                                <input type="text" id="cvc" name="cvc" value={newPayment.cvc} onChange={handleInputChange} required />
                            </div>
                            <button type="button" onClick={handleAddPayment}>Añadir tarjeta</button>
                        </form>
                    </div>
                );
            case 'paypal':
                return (
                    <div className="payment-form">
                        <form>
                            <div className="form-row">
                                <label htmlFor="email">Correo electrónico PayPal</label>
                                <input type="email" id="email" name="email" value={newPayment.email} onChange={handleInputChange} required />
                            </div>
                            <button type="button" onClick={handleAddPayment}>Añadir cuenta PayPal</button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="payment-container">
            <h2>Metodos de pago añadidos</h2>
            {paymentMethods.map(method => (
                <div key={method.type} className="payment-methods">
                    {method.label && <h3>{method.label}</h3>}
                    {method.type === 'creditCard' && (
                        <Cards
                            cvc={method.cvc}
                            expiry={method.expiry}
                            focused="number"
                            name={method.name}
                            number={method.number}
                        />
                    )}
                    {method.type === 'paypal' && (
                        <p>Correo electrónico PayPal: {method.email}</p>
                    )}
                </div>
            ))}
            <h2>Añadir método de pago</h2>
            <div className="payment-form">
                <select value={newPayment.type} onChange={handleInputChange}>
                    <option value="creditCard">Tarjeta de crédito</option>
                    <option value="paypal">PayPal</option>
                </select>
                {renderPaymentForm()}
            </div>
        </div>
    );
};

export default Payment;
