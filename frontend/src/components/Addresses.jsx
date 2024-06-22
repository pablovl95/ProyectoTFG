import React, { useState, useEffect } from "react";
import './css/Addresses.css';
import { IconCirclePlus } from '@tabler/icons-react';
import AddressesForm from "./AddressesForm";

const Addresses = ({ userData, setAddress, Screen, setNotification }) => {
    const [addresses, setAddresses] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [AddressSelected, setAddressSelected] = useState(null);

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
            .then(data => {
                if (data.length > 0) {
                    const AddressDefaultID = data.filter(x => x.DefaultAddress == 1);
                    if (AddressDefaultID.length > 0) {
                        setAddressSelected(AddressDefaultID[0].AddressID);
                        if (Screen === "cart") {
                            setAddress(AddressDefaultID[0].AddressID);
                        }
                    } else {
                        setAddressSelected(null);
                    }
                }
                setAddresses(data);
            }
            )
            .catch(error => {
                setNotification({ type: 'error', message: 'Error al obtener las direcciones' });
                console.error('Error fetching addresses:', error)
            });
    }, [userData.UserID, Screen]);
    const handleEditButtonClick = (event, index) => {
        event.stopPropagation();
        openEditForm(index);
    };

    const handleDeleteButtonClick = (event, index) => {
        event.stopPropagation();
        handleDeleteAddress(index);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const e = event.target;
        const form = {
            AddressID: editingIndex !== null ? addresses[editingIndex].AddressID : null,
            AddressTitle: e.AddressTitle.value,
            FirstName: e.FirstName.value,
            LastName: e.LastName.value,
            Phone: e.Phone.value,
            AddressLine: e.AddressLine.value,
            AddressNumber: e.AddressNumber.value,
            PostalCode: e.PostalCode.value,
            City: e.City.value,
            Province: e.Province.value,
            Country: e.Country.value,
            DefaultAddress: addresses.length === 0 ? 1 : 0 // Set as default if it's the first address
        };

        const url = editingIndex !== null ? '/' + form.AddressID : '';
        const method = editingIndex !== null ? 'PUT' : 'POST';

        try {
            const response = await fetch(`${backendUrl}/api/v1/addresses${url}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...form, UserID: userData.UserID })
            });
            if (editingIndex !== null) {
                const newAddresses = [...addresses];
                console.log(form);
                newAddresses[editingIndex] = form;
                setAddresses(newAddresses);
            } else {
                const data = await response.json();
                setAddressSelected(data.AddressID);
                setAddresses([...addresses, data]);
            }
            closeForm();
            setNotification({ type: 'success', message: 'Dirección guardada correctamente' });
        } catch (error) {
            console.error('Error submitting address form:', error);
            setNotification({ type: 'error', message: 'Error al guardar la dirección' });
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
        console.log("addressID", addressID);
        if (Screen === "cart") {
            setAddress(addressID);
            setAddressSelected(addressID);
        } else {
            if (window.confirm("¿Quieres poner esta dirección como dirección por defecto?")) {
                setDefaultAddress(addressID);
            }
        }


    };

    const setDefaultAddress = async (addressID) => {
        try {
            console.log(`/api/v1/defaultAddress/${userData.UserID}/${addressID}`)
            const response = await fetch(`${backendUrl}/api/v1/defaultAddress/${userData.UserID}/${addressID}`);
            if (response.ok) {
                const updatedAddresses = addresses.map(address => {
                    if (address.AddressID === addressID) {
                        return { ...address, DefaultAddress: 1 };
                    } else {
                        return { ...address, DefaultAddress: 0 };
                    }
                });
                setAddresses(updatedAddresses);
                setNotification({ type: 'success', message: 'Dirección por defecto establecida correctamente' });
            } else {
                console.error('Error setting default address:', response.statusText);
                setNotification({ type: 'error', message: 'Error al establecer la dirección por defecto' });
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            setNotification({ type: 'error', message: 'Error al establecer la dirección por defecto' });
        }
    };


    const handleDeleteAddress = async (index) => {
        const addressToDelete = addresses[index];
        setAddresses(addresses.filter((_, idx) => idx !== index));
        try {
            const response = await fetch(`${backendUrl}/api/v1/addresses/${addressToDelete.AddressID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...addressToDelete, UserID: "null" })
            });
            setNotification({ type: 'success', message: 'Dirección eliminada correctamente' });
        } catch (error) {
            console.error('Error deleting address:', error);
            setNotification({ type: 'error', message: 'Error al eliminar la dirección' });
        }
    };

    return (
        <div className="Addresses-content">
            <h4>Direcciones Actuales</h4>
            <div className="profile-details-address">
                {addresses.map((address, idx) => {
                    return (
                        <div
                            className={`profile-details-address-details ${AddressSelected === address.AddressID && Screen == "cart" || address.DefaultAddress === 1 && Screen == "data" ? 'default-address' : ''}`}
                            key={idx}
                            onClick={() => handleAddressSelect(address.AddressID)}>
                            <h4>{address.AddressTitle}</h4>
                            {address.DefaultAddress === 1 && <p>(Dirección por defecto)</p>}
                            <p>Nombre {address.FirstName + " " + address.LastName}</p>
                            <p>Teléfono {address.Phone}</p>
                            <p>Dirección {address.AddressLine + ", " + address.AddressNumber}</p>
                            <p>Población {address.City}</p>
                            <p>Provincia {address.Province}</p>
                            <p>Código Postal {address.PostalCode}</p>
                            <p>País {address.Country}</p>
                            <div className="profile-details-addresses-edit-button" onClick={(event) => handleEditButtonClick(event, idx)}>
                                Editar Dirección
                            </div>
                            <div className="profile-details-addresses-delete-button" onClick={(event) => handleDeleteButtonClick(event, idx)}>
                                Eliminar Dirección
                            </div>

                        </div>
                    )
                })}
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
