import React, { useState } from 'react';
import './css/Shipping.css';
import { IconCirclePlus } from '@tabler/icons-react';
import AddressesForm from './AddressesForm';
import { generateCustomSequence } from "../utils/utils";

const Shipping = ({ setActiveComponent, cart, cartTotal, setAddress }) => {
    const [shippingMethod, setShippingMethod] = useState('express');
    const [addresses, setAddresses] = useState([
        {
            AddressID: "9f6f21f1356d4d1abb89049e7a9d0aa0",
            title: 'Casa',
            FirstName: 'Pablo',
            LastName: 'Vera Lopez',
            Phone: '667218105',
            AddressLine: 'Real De Abajo 31',
            AddressNumber: 'A',
            City: 'Valverde Del Camino',
            Country: 'España',
            Province: 'Huelva',
            PostalCode: '21600',
            DefaultAddress: 1,
        }
    ]);

    const [emptyAddress, setEmptyAddress] = useState({
        AddressID: generateCustomSequence(),
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
    const [editingIndex, setEditingIndex] = useState(null);
    const [selectedAddressID, setSelectedAddressID] = useState(
        addresses.find(address => address.DefaultAddress === 1)?.AddressID || ''
    );

    const handleShippingChange = (event) => {
        setShippingMethod(event.target.value);
    };

    const addNewAddress = () => {
        setIsAddingAddress(true);
        setEmptyAddress({
            AddressID: generateCustomSequence(), // Generate a new ID for the new address
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
        setEditingIndex(null);
    };

    const editAddresses = (index) => {
        setIsAddingAddress(true);
        setEmptyAddress(addresses[index]); // Load the existing address into the form
        setEditingIndex(index);
    };

    const handleClickPayment = () => {
        if (selectedAddressID) {
            setAddress(selectedAddressID);
            setActiveComponent('payment');
        } else {
            console.error("No se ha seleccionado ninguna dirección.");
        }
    };

    const closeForm = () => {
        setIsAddingAddress(false);
        setEmptyAddress({
            AddressID: generateCustomSequence(),
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
        setEditingIndex(null);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newAddress = {
            AddressID: emptyAddress.AddressID, // Preserve the AddressID
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
            DefaultAddress: editingIndex !== null ? addresses[editingIndex].DefaultAddress : 0, // Maintain DefaultAddress if editing
        };

        if (editingIndex !== null) {
            const updatedAddresses = addresses.map((address, index) =>
                index === editingIndex ? newAddress : address
            );
            setAddresses(updatedAddresses);
        } else {
            setAddresses([...addresses, newAddress]);
        }

        closeForm();
    };

    const handleAddressSelect = (addressID) => {
        setSelectedAddressID(addressID);
    };

    return (
        <div className="shipping-container">
            {isAddingAddress && (
                <AddressesForm
                    emptyAddress={emptyAddress}
                    handleFormSubmit={handleFormSubmit}
                    closeForm={closeForm}
                    editingIndex={editingIndex}
                />
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
                                <div
                                    className={`address-card ${address.AddressID === selectedAddressID ? 'selected' : ''} ${address.DefaultAddress === 1 ? 'default-address' : ''}`}
                                    key={address.AddressID}
                                    onClick={() => handleAddressSelect(address.AddressID)}
                                >
                                    <div className="address-details">
                                        <h4>{address.title}</h4>
                                        <p>Nombre: {address.FirstName + " " + address.LastName}</p>
                                        <p>Teléfono: {address.Phone}</p>
                                        <p>Dirección: {address.AddressLine + ", " + address.AddressNumber}</p>
                                        <p>Población: {address.City}</p>
                                        <p>Provincia: {address.Province}</p>
                                        <p>Código Postal: {address.PostalCode}</p>
                                        <p>País: {address.Country}</p>
                                        {address.DefaultAddress === 1 && <p>(Dirección por defecto)</p>}
                                    </div>
                                    <button onClick={() => editAddresses(index)}>Editar</button>
                                </div>
                            ))}
                            <div className="address-card add-address" onClick={addNewAddress}>
                                <div className="address-details">
                                    <IconCirclePlus color='green' />
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
