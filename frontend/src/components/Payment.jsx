import React, { useState } from 'react';


const Payment = ({ setActiveComponent }) => {
    return (
        <div className="payment-container">
            <h2>Información de Pago</h2>
            {/* Aquí puedes añadir el formulario o la información de pago */}
            <button onClick={() => setActiveComponent('shipping')}>Volver a Envío</button>
            <button onClick={() => alert('Compra finalizada!')}>Finalizar Compra</button>
        </div>
    );
};

export default Payment;