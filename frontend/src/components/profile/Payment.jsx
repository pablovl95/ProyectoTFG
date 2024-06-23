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

const Payment = ({ setActiveComponent, userData, cartTotal, AddressID, changeCart, Screen, shippingCostTotal, setNotification }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectOption, setSelectOption] = useState("Tarjeta de crédito");
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [openPaymentForm, setOpenPaymentForm] = useState(false);
    const navigate = useNavigate();
    const backendUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/v1/users/payment/${userData.UserID}`);
                const data = await response.json();
                if (data.length === 0) {
                    return;
                }
                const methods = data.map((x) => ({
                    PaymentMethodID: x.PaymentMethodID,
                    MethodType: x.PaymentMethodType,
                    ContentText: JSON.parse(x.ContentText),
                }));
                setPaymentMethods(methods);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
                setNotification({ type: 'error', message: 'Ha ocurrido un error al cargar los metodos de pago.' });
            }
        };
        fetchPaymentMethods();
    }, [userData.UserID]);
    const handleApplyCoupon = () => {
        setNotification({ type: 'info', message: 'Esta funcionalidad estara disponible en versiones posteriores' });
    };

    const handleAddPaymentMethod = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newPaymentMethod = {
            UserID: userData.UserID,
            PaymentMethodType: selectOption,
            ContentText: JSON.stringify(Object.fromEntries(formData.entries()))
        };
        try {
            const response = await fetch(`${backendUrl}/api/v1/users/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPaymentMethod),
            });

            if (!response.ok) {
                throw new Error('Failed to add payment method');
            }

            const addedMethod = await response.json();
            const methods = {
                PaymentMethodID: addedMethod.PaymentMethodID,
                MethodType: addedMethod.PaymentMethodType,
                ContentText: JSON.parse(addedMethod.ContentText),
            };
            setPaymentMethods([...paymentMethods, methods]);
            setOpenPaymentForm(false);
            setNotification({ type: 'success', message: 'Metodo de pago añadido correctamente' });

        } catch (error) {
            console.error('Error adding payment method:', error);
            setNotification({ type: 'error', message: 'Ha ocurrido un error al añadir los metodos de pago' });
        }
    };

    const handleDeletePaymentMethod = async (methodId) => {

        try {
            const response = await fetch(`${backendUrl}/api/v1/users/payment/${methodId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete payment method');
            }

            setPaymentMethods(paymentMethods.filter(method => method.PaymentMethodID !== methodId));

            if (selectedMethod && selectedMethod.PaymentMethodID === methodId) {
                setSelectedMethod(null);
            }
            setNotification({ type: 'success', message: 'Metodo de pago borrado con exito' });
        } catch (error) {
            console.error('Error deleting payment method:', error);
            setNotification({ type: 'error', message: 'Ha ocurrido un error al borrar los metodos de pago' });
        }
    };

    const handleCheckout = () => {
        if (!selectedMethod) {
            setNotification({ type: 'error', message: 'Por favor, selecciona un método de pago' });
            return;
        }

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
            PaymentMethodID: selectedMethod.PaymentMethodID, // Añadimos el método de pago seleccionado
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
                setNotification({ type: 'error', message: 'Ha ocurrido un error al realizar el pedido' });
            });
    };

    const PaymentForm = ({ selectOption, setOpenPaymentForm }) => {
        const renderFormFields = () => {
            switch (selectOption) {
                case 'Tarjeta de crédito':
                    return (
                        <>
                            <div>
                                <label>Número de tarjeta:</label>
                                <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" required />
                            </div>
                            <div>
                                <label>Fecha de caducidad:</label>
                                <input type="text" name="expiryDate" placeholder="MM/AA" required />
                            </div>
                            <div>
                                <label>CVV:</label>
                                <input type="text" name="cvv" placeholder="123" required />
                            </div>
                            <div>
                                <label>Nombre del titular de la tarjeta:</label>
                                <input type="text" name="cardHolderName" placeholder="" required />
                            </div>
                        </>
                    );
                case 'Bizum':
                    return (
                        <div>
                            <label>Número de teléfono:</label>
                            <input type="text" name="phoneNumber" placeholder="123 456 789" required />
                        </div>
                    );
                case 'Paypal':
                case 'Google pay':
                case 'Apple pay':
                    return (
                        <div>
                            <label>Cuenta asociada:</label>
                            <input type="text" name="account" placeholder="email@example.com" required />
                        </div>
                    );
                default:
                    return <div>Por favor, selecciona un método de pago.</div>;
            }
        };

        return (
            <div className="payment-form-container">
                <form onSubmit={handleAddPaymentMethod}>
                    {renderFormFields()}
                    <div className="payment-buttons-row">
                        <button type="submit" className="payment-button" style={{ backgroundColor: "#28a745", color: "white" }}>Guardar</button>
                        <button onClick={() => setOpenPaymentForm(false)} style={{ backgroundColor: "#b64848", color: "white" }} className="payment-button">Cerrar</button>
                    </div>
                </form>

            </div>
        );
    };

    const renderPaymentMethodCard = (method) => {
        const isSelected = selectedMethod && selectedMethod.PaymentMethodID === method.PaymentMethodID;
        return (
            <div className={`payment-card-content ${isSelected ? 'selected' : ''}`} key={method.PaymentMethodID}
                onClick={() => setSelectedMethod(method)}>
                {Object.entries(method.ContentText).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
                <button
                    className="payment-button-delete"
                    onClick={(e) => { e.stopPropagation(); handleDeletePaymentMethod(method.PaymentMethodID); }}
                >
                    Eliminar
                </button>
            </div>
        );
    };


    const renderSelector = (option) => {
        switch (option) {
            case 'Tarjeta de crédito':
                return (<><IconCreditCard /> Tarjeta de crédito</>);
            case 'Bizum':
                return (<><IconDeviceMobileMessage /> Bizum </>);
            case 'Paypal':
                return (<><IconBrandPaypal /> Paypal </>);
            case 'Google pay':
                return (<><IconBrandGoogle /> Google pay </>);
            case 'Apple pay':
                return (<><IconBrandApple /> Apple pay </>);
            default:
                return 'Selecciona un método de pago';
        }
    };

    return (
        <div className={Screen === "Details" ? "cart-payment-container-details" : "cart-payment-container"}>
            <div className={Screen === "Details" ? "cart-payment-content-details" : "cart-payment-content"}>
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
                            <a onClick={() => { setSelectorOpen(false); setSelectOption("Google pay"); }}>
                                {renderSelector('Google pay')}
                            </a>
                            <a onClick={() => { setSelectorOpen(false); setSelectOption("Apple pay"); }}>
                                {renderSelector('Apple pay')}
                            </a>
                        </div>
                    )}
                </div>
                {!openPaymentForm &&
                    <div className="payment-button" style={{ backgroundColor: "#ccc", marginBottom: "1rem", color: "white" }} onClick={() => setOpenPaymentForm(!openPaymentForm)}>
                        Añadir un nuevo
                    </div>
                }
                <h2>Metodos de pago</h2>
                {openPaymentForm && <PaymentForm selectOption={selectOption} setOpenPaymentForm={setOpenPaymentForm} />}
                {paymentMethods.map(method => renderPaymentMethodCard(method))}
            </div>
            {Screen !== 'Details' && (
                <div className={"cart-payment-summary"}>
                    <h3>Resumen</h3>
                    <div className="payment-summary-details">
                        <p>Subtotal: {cartTotal} €</p>
                        <p>Gastos de envío: {parseFloat(shippingCostTotal).toFixed(2)} €</p>
                        <p>TOTAL: {(parseFloat(cartTotal) + parseFloat(shippingCostTotal)).toFixed(2)} € (IVA incluido)</p>
                        <p>Revisa los pedidos a los productores para ver si puedes ahorrarte algo en gastos de envío!</p>
                        <input type="text" placeholder="¿Dispones de un cupón?" />
                        <button className='payment-button' style={{ backgroundColor: "#17a2b8", color: "white" }} onClick={handleApplyCoupon}>Aplicar</button>
                        <button className='payment-button' onClick={handleCheckout} style={{ backgroundColor: "#28a745", color: "white" }}>Pagar y Finalizar Compra</button>
                    </div>
                </div>)}
        </div >
    );
};

export default Payment;
