import React, { useState } from 'react';
import './css/Shipping.css';
import { IconCirclePlus, IconCircleX } from '@tabler/icons-react';

const Shipping = ({ setActiveComponent }) => {
    const [shippingMethod, setShippingMethod] = useState('express');
    const [addresses, setAddresses] = useState([
        {
            title: 'Casa',
            FirstName: 'pablo',
            LastName: 'vera lopez',
            Phone: '667218105',
            AddressLine: 'Real De Abajo 31',
            AddressNumber: 'A',
            City: 'Valverde Del Camino',
            Country: 'España',
            Province: 'Huelva',
            PostalCode: '21600',
        }
    ]);
    const [emptyAddress, setEmptyAddress] = useState({
        title: '',
        FirstName: '',
        LastName: '',
        Phone: '',
        AddressLine: '',
        AddressNumber: '',
        City: '',
        Country: '',
        Province: '',
        PostalCode: '',
    });
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    const handleShippingChange = (event) => {
        setShippingMethod(event.target.value);
    };

    const addNewAddress = () => {
        setIsAddingAddress(true);
    };
    const editAdresses = (address) => {
        setIsAddingAddress(true);

    };

    const closeForm = () => {
        setIsAddingAddress(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newAddress = {
            title: formData.get('title'),
            FirstName: formData.get('firstName'),
            LastName: formData.get('lastName'),
            Phone: formData.get('phone'),
            AddressLine: formData.get('addressLine'),
            AddressNumber: formData.get('addressNumber'),
            City: formData.get('city'),
            Province: formData.get('province'),
            Country: formData.get('country'),
            PostalCode: formData.get('postalCode'),
        };
        setAddresses([...addresses, newAddress]);
        closeForm();
    };

    return (
        <div className="shipping-container">
            {isAddingAddress && (
                <div className="overlay">
                    <div className="address-form">
                        <div className="address-form-header" onClick={closeForm}>
                            <h3>Añadir dirección</h3>
                            <IconCircleX color='white' style={{ padding: "1rem" }}></IconCircleX>
                        </div>
                        <div className="address-form-container">
                            <form onSubmit={handleFormSubmit}>
                                <div className='form-title'>
                                    <label htmlFor="title">Título de dirección</label>
                                    <input type="text" id="title" name="title" required />
                                </div>
                                <div className='form-row-data'>
                                    <div>
                                        <label htmlFor="firstName">Nombre</label>
                                        <input type="text" id="firstName" name="firstName" required />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName">Apellido</label>
                                        <input type="text" id="lastName" name="lastName" required />
                                    </div>
                                    <div>
                                        <label htmlFor="phone">Teléfono</label>
                                        <input type="text" id="phone" name="phone" required />
                                    </div>
                                </div>
                                <div className='form-row-data'>
                                    <div>
                                        <label htmlFor="addressLine">Dirección</label>
                                        <input type="text" id="addressLine" name="addressLine" required />
                                    </div>
                                    <div>
                                        <label htmlFor="addressNumber">Número</label>
                                        <input type="text" id="addressNumber" name="addressNumber" required />
                                    </div>
                                    <div>
                                        <label htmlFor="postalCode">Código Postal</label>
                                        <input type="text" id="postalCode" name="postalCode" required />
                                    </div>
                                </div>
                                <div className='form-row-data'>
                                    <div>
                                        <label htmlFor="city">Ciudad</label>
                                        <input type="text" id="city" name="city" required />
                                    </div>
                                    <div>
                                        <label htmlFor="province">Provincia</label>
                                        <input type="text" id="province" name="province" required />
                                    </div>
                                    <div>
                                        <label htmlFor="country">País</label>
                                        <input type="text" id="country" name="country" required />
                                    </div>
                                </div>
                                <div className="form-buttons">
                                    <button type="button" onClick={closeForm}>Cancelar</button>
                                    <button type="submit">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
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
                    <>
                        <h3>Direcciones actuales</h3>
                        <div className="current-address">
                            {addresses.map((address, index) => (
                                <div className="address-card" key={index}>
                                    <div className="address-details">
                                        <h4>{address.title}</h4>
                                        <p>Nombre {address.FirstName + " " + address.LastName}</p>
                                        <p>Teléfono {address.Phone}</p>
                                        <p>Dirección {address.AddressLine + "," + address.AddressNumber}</p>
                                        <p>Población {address.City}</p>
                                        <p>Provincia {address.Province}</p>
                                        <p>Código Postal {address.PostalCode}</p>
                                        <p>País {address.Country}</p>
                                    </div>
                                    <button onClick={editAdresses(address)}>Editar</button>
                                </div>
                            ))}
                            <div className="address-card add-address" onClick={addNewAddress}>
                                <div className="address-details">
                                    <IconCirclePlus color='green'></IconCirclePlus>
                                    <p>Añadir dirección</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="shipping-summary">
                <h3>Resumen</h3>
                <div className="summary-details">
                    <p>Subtotal: 21,60 €</p>
                    <p>Gastos de envío: 2,90 €</p>
                    <p>TOTAL: 24,50 € (IVA incluido)</p>
                    <p>Añade a tu cuenta hasta +0,65 € para tu siguiente compra.</p>
                    <input type="text" placeholder="¿Dispones de un cupón?" />
                    <button>Aplicar</button>
                    <button>Siguiente paso</button>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
