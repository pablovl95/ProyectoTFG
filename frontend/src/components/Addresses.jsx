import React, { useState, useEffect } from "react";
import './css/Addresses.css';
import { IconCirclePlus } from '@tabler/icons-react';
import AddressesForm from "./AddressesForm";

const Addresses = ({ userData, setAddress }) => {
    const [addresses, setAddresses] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false); // State for form visibility
    const [editingIndex, setEditingIndex] = useState(null); // State for tracking editing index
    const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL;
    const [emptyAddress, setEmptyAddress] = useState({
        AddressTitle: '',
        FirstName: '',
        LastName: '',
        Phone: '',
        AddressLine: '',
        AddressNumber: '',
        PostalCode: '',
        City: '',
        Province: '',
        Country: ''
    });

    useEffect(() => {
        fetch(`${backendUrl}/api/v1/addresses/${userData.UserID}`)
            .then(response => response.json())
            .then(data => setAddresses(data))
            .catch(error => console.error('Error fetching addresses:', error));

    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const e = event.target;
        const form = {
            AddressID: editingIndex !== null ? addresses[editingIndex].AddressID : null,
            AddressTitle: e.AddressTitle.value,
            FirstName: e.firstName.value,
            LastName: e.lastName.value,
            Phone: e.phone.value,
            AddressLine: e.addressLine.value,
            AddressNumber: e.addressNumber.value,
            PostalCode: e.postalCode.value,
            City: e.city.value,
            Province: e.province.value,
            Country: e.country.value,
        };
        if (editingIndex == null) {
            form.UserID = userData.UserID;
        }
        const url = editingIndex !== null ? '/' + form.AddressID : '';
        const method = editingIndex !== null ? 'PUT' : 'POST'
        const response = fetch(`${backendUrl}/api/v1/addresses${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...form, DefaultAddress: 0, AddressID: editingIndex !== null ? addresses[editingIndex].AddressID : null }),
        })

        if (editingIndex !== null) {
            const newAddresses = [...addresses];
            newAddresses[editingIndex] = form;
            setAddresses(newAddresses);
            closeForm();
        } else {
            setAddresses([...addresses, form]);
            closeForm();
        }
    }

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingIndex(null);
        setEmptyAddress({
            AddressTitle: '',
            FirstName: '',
            LastName: '',
            Phone: '',
            AddressLine: '',
            AddressNumber: '',
            PostalCode: '',
            City: '',
            Province: '',
            Country: ''
        });
    };

    const openEditForm = (index) => {
        setIsFormOpen(true);
        setEditingIndex(index);
        setEmptyAddress(addresses[index]);
    };

    const handleAddressSelect = (addressID) => {
        setAddress(addressID); 
    };

    return (
        <div className="Addresses-content">
            <h4>Direcciones Actuales</h4>
            <div className="profile-details-address">
                {addresses.map((address, idx) => (
                    <div className="profile-details-address-details" key={idx} onClick={() => handleAddressSelect(address.AddressID)}>
                        <h4>{address.AddressTitle}</h4>
                        {address.DefaultAddress === 1 && <p>(Dirección por defecto)</p>}
                        <p>Nombre {address.FirstName + " " + address.LastName}</p>
                        <p>Teléfono {address.Phone}</p>
                        <p>Dirección {address.AddressLine + ", " + address.AdressNumber}</p>
                        <p>Población {address.City}</p>
                        <p>Provincia {address.Province}</p>
                        <p>Código Postal {address.PostalCode}</p>
                        <p>País {address.Country}</p>
                        <div className="profile-details-addresses-edit-button" onClick={() => openEditForm(idx)}>
                            Editar Dirección
                        </div>
                    </div>
                ))}

                <div className="profile-details-address-details" onClick={openForm}>
                    <IconCirclePlus color='green' />
                    <p>Añadir dirección</p>
                </div>
            </div>
            {isFormOpen && (
                <AddressesForm
                    emptyAddress={emptyAddress}
                    handleFormSubmit={handleFormSubmit}
                    closeForm={closeForm}
                    editingIndex={editingIndex}
                />
            )}
        </div>
    );
};

export default Addresses;
