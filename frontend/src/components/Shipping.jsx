import React, { useState } from 'react';
import './css/Shipping.css';
import Addresses from './Addresses';

const Shipping = ({ setActiveComponent, cart, cartTotal, userData, setAddress }) => {
    const [shippingMethod, setShippingMethod] = useState('express');
    const [AddressSelected, setAddressSelected] = useState(null);

    const handleShippingChange = (event) => {
        setShippingMethod(event.target.value);
    };

    const handleAddressSelect = (addressID) => {
        setAddress(addressID);
        setAddressSelected(addressID);
    };

    const handleClickPayment = () => {
        if (AddressSelected) {
            setActiveComponent('payment');
        }else {
            alert('Por favor, selecciona una dirección de envío');
        } 
    };

    return (
        <div className="shipping-container">
            <div className="shipping-method">
                <h3>¿A dónde enviamos tu pedido?</h3>
                <div className="shipping-options">
                    <div className="shipping-option">
                        <label htmlFor="pickup">Enviar a punto de recogida</label>
                        <input
                            type="radio"
                            id="pickup"
                            name="shipping"
                            value="pickup"
                            checked={shippingMethod === 'pickup'}
                            onChange={handleShippingChange}
                        />
                    </div>
                    <div className="shipping-option">
                        <label htmlFor="express">Enviar a mi dirección</label>
                        <input
                            type="radio"
                            id="express"
                            name="shipping"
                            value="express"
                            checked={shippingMethod === 'express'}
                            onChange={handleShippingChange}
                        />
                    </div>
                    <div className="shipping-option">
                        <label htmlFor="gift">Enviar a otra dirección</label>
                        <input
                            type="radio"
                            id="gift"
                            name="shipping"
                            value="gift"
                            checked={shippingMethod === 'gift'}
                            onChange={handleShippingChange}
                        />
                    </div>
                </div>
                {shippingMethod === 'express' && (
                    <Addresses userData={userData} setAddress={handleAddressSelect} Screen={"cart"} />
                )}
            </div>
            <div className="shipping-summary">
                <h3>Resumen</h3>
                <div className="summary-details">
                    <p>Subtotal: {cartTotal} €</p>
                    <p>Gastos de envío: 2,90 €</p>
                    <p>TOTAL: {(cartTotal) + 2.90} (IVA incluido)</p>
                    <p>Revisa los pedidos a los productores para ver si puedes ahorrarte algo en gastos de envío!!</p>
                    <input type="text" placeholder="¿Dispones de un cupón?" />
                    <button>Aplicar</button>
                    <button onClick={handleClickPayment}>Siguiente paso</button>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
