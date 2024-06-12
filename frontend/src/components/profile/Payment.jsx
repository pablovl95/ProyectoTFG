import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    IconBrandPaypal,
    IconCreditCard,
    IconBrandApple,
    IconDeviceMobileMessage,
    IconBrandGoogle
} from '@tabler/icons-react';
import "../css/profile/Payment.css";

// Import the PaymentForm component
import { PaymentForm } from '../../utils/utils'; // adjust the path according to your file structure

const Payment = ({ setActiveComponent, userData, cartTotal, AddressID, changeCart }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectOption, setSelectOption] = useState("Tarjeta de crédito");
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [OpenPaymentForm, setOpenPaymentForm] = useState(false);
    const navigate = useNavigate();
    const backendUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        // Puedes cargar los métodos de pago desde el backend si es necesario
        const fetchPaymentMethods = async () => {
            const response = await fetch(`${backendUrl}/api/v1/users/payment/${userData.UserID}`);
            const data = await response.json();
            const methods = data.map((x) => ({
                metododepagoID: x.metododepagoID,
                MethodType: x.MethodType,
                ContentText: JSON.parse(x.ContentText),
            }));
            setPaymentMethods(methods);
        };
        fetchPaymentMethods();
    }, [AddressID]);

    const handleCheckout = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const datav2 = cart.map((item) => ({
            ProductID: item.ProductID,
            ShopID: item.ShopID,
            AddressID: AddressID,
            Quantity: item.quantity,
        }));
        const datav1 = {
            UserID: userData.UserID,
            AddressID: AddressID,
            OrderDate: new Date().toISOString(),
            TOTAL: cartTotal,
            Products: JSON.stringify(datav2),
        };

        fetch(`${backendUrl}/api/v1/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datav1),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Failed to create order');
                    throw new Error('Failed to create order');
                }
            })
            .then(() => {
                localStorage.removeItem('cart');
                changeCart();
                navigate('/profile/summary');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const renderPaymentMethodCard = (method) => {
        return (
            <div className="payment-details">
                <h3>Método de Pago Añadidos</h3>
                <div className={``}
                    onClick={() => setSelectedMethod(method)}
                >
                    <div className="payment-card-content">
                        {
                            paymentMethods.filter((method) => (method.MethodType === selectOption)).map((method) => {
                                return Object.entries(method.ContentText).map(([key, value]) => (
                                    <p key={key}><strong>{key}:</strong> {value}</p>
                                ));
                            })
                        }
                    </div>
                </div>
            </div>);
    };

    const renderSelector = (option) => {
        switch (option) {
            case 'Tarjeta de crédito':
                return (<><IconCreditCard /> Tarjeta de crédito</>);
            case 'Bizum':
                return (<><IconDeviceMobileMessage /> Bizum </>);
            case 'Paypal':
                return (<><IconBrandPaypal /> Paypal </>);
            case 'Google play':
                return (<><IconBrandGoogle /> Google play </>);
            case 'Apple play':
                return (<><IconBrandApple /> Apple play </>);
            default:
                return 'Selecciona un método de pago';
        }
    };

    return (
        <div className="cart-payment-container">
            <div className="cart-payment-content">
                <h2>Información de Pago</h2>
                <div className="cart-payment-selector">
                    <a
                        className="cart-payment-selector-header"
                        onClick={() => setSelectorOpen(!selectorOpen)}
                    >
                        {selectorOpen ? "Selecciona un método de pago" : renderSelector(selectOption)}
                    </a>
                    {selectorOpen && (
                        <div className="cart-payment-options">
                            <a onClick={() => { setSelectorOpen(false); setSelectOption("Tarjeta de crédito"); }}>
                                {renderSelector('Tarjeta de crédito')}
                            </a>
                            <a onClick={() => { setSelectorOpen(false); setSelectOption("Bizum"); }}>
                                {renderSelector('Bizum')}
                            </a>
                            <a onClick={() => { setSelectorOpen(false); setSelectOption("Paypal"); }}>
                                {renderSelector('Paypal')}
                            </a>
                            <a onClick={() => { setSelectorOpen(false); setSelectOption("Google play"); }}>
                                {renderSelector('Google play')}
                            </a>
                            <a onClick={() => { setSelectorOpen(false); setSelectOption("Apple play"); }}>
                                {renderSelector('Apple play')}
                            </a>
                        </div>
                    )}
                </div>
                {!OpenPaymentForm &&
                    <a onClick={() => setOpenPaymentForm(!OpenPaymentForm)}>Añadir un nueva</a>
                }
                {OpenPaymentForm && <PaymentForm selectOption={selectOption} setOpenPaymentForm={setOpenPaymentForm} />}
                {renderPaymentMethodCard(selectedMethod)}
            </div>
            <div className="cart-payment-summary">
                <h3>Resumen</h3>
                <div className="summary-details">
                    <p>Subtotal: {cartTotal} €</p>
                    <p>Gastos de envío: 2,90 €</p>
                    <p>TOTAL: {(cartTotal + 2.90)} € (IVA incluido)</p>
                    <p>Revisa los pedidos a los productores para ver si puedes ahorrarte algo en gastos de envío!</p>
                    <input type="text" placeholder="¿Dispones de un cupón?" />
                    <button>Aplicar</button>
                    <button onClick={() => setActiveComponent('shipping')}>Volver a Envío</button>
                    <button onClick={handleCheckout}>Pagar y Finalizar Compra</button>
                </div>
            </div>
        </div >
    );
};

export default Payment;
