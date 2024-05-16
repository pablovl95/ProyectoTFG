import React, { useEffect, useState } from 'react';
import { auth } from '../auth';
import './css/Addresses.css';
import { ClipLoader } from 'react-spinners';
import { IconPencil, IconPencilMinus } from '@tabler/icons-react';



function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    AddressType: '',
    StreetAddress: '',
    StreetNumber: '',
    Floor: '',
    Country: '',
    State: '',
    City: '',
    PostalCode: '',
    Staircase: 'NO',
  });

  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/addresses/` + auth.currentUser.uid)
      .then(response => response.json())
      .then(data => setAddresses(data));
  }, []);

  const handleRegisterAddress = () => {
    setShowForm(true);
  };
  const handleDeleteAddress = async (address) => {
    // Mostrar un mensaje de confirmación al usuario antes de eliminar la dirección
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar esta dirección?`);
    
    if (confirmDelete) {
      try {
        const response = await fetch(`${backendUrl}/api/v1/addresses/${address.AddressID}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Actualizar la lista de direcciones después de eliminar la dirección
          setAddresses(addresses.filter(addr => addr.AddressID !== address.AddressID));
          alert('Dirección eliminada correctamente');
        } else {
          console.error('Error al eliminar la dirección:', response.statusText);
          alert('Error al eliminar la dirección. Inténtalo de nuevo más tarde.');
        }
      } catch (error) {
        console.error('Error al eliminar la dirección:', error.message);
        alert('Error al eliminar la dirección. Inténtalo de nuevo más tarde.');
      }
    }
  };
  
const handleEditAddress = (AddressID) =>{
  console.log("editando", AddressID);
}
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`${backendUrl}/api/v1/addresses/` + auth.currentUser.uid)
    fetch(`${backendUrl}/api/v1/addresses/` + auth.currentUser.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAddress), // Incluye newAddress en el cuerpo de la solicitud
    })
      .then(window.location.reload())
  };


  return (
    <div className="addresses-container">
      <h1>Addresses</h1>
      <div className="addresses-card-container">
        <div className="address-container" onClick={handleRegisterAddress}>
          <h3>Añade una nueva dirección</h3>
          <div className="separator"></div>
          <p>Para añadir una nueva dirección, haz click aqui.</p>
        </div>
        {showForm && (
          <form className="address-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="AddressType"
              placeholder="Tipo de dirección"
              value={newAddress.AddressType}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="StreetAddress"
              placeholder="Calle"
              value={newAddress.StreetAddress}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="StreetNumber"
              placeholder="Número"
              value={newAddress.StreetNumber}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="Floor"
              placeholder="Piso"
              value={newAddress.Floor}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="Country"
              placeholder="País"
              value={newAddress.Country}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="State"
              placeholder="Estado"
              value={newAddress.State}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="City"
              placeholder="Ciudad"
              value={newAddress.City}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="PostalCode"
              placeholder="Código Postal"
              value={newAddress.PostalCode}
              onChange={handleInputChange}
              required
            />
            <label>
              Escaleras:
              <select name="Staircase" value={newAddress.Staircase} onChange={handleInputChange}>
                <option value="YES">SI</option>
                <option value="NO">NO</option>
              </select>
            </label>
            <button type="submit">Registrar Dirección</button>
          </form>
        )}
        {addresses ? addresses.map(address => (
          <div className="address-container" key={address?.AddressID}>
            <h3>{address?.AddressType}</h3>
            <div className="separator"></div>
            <p>{address?.StreetAddress}, {address?.StreetNumber}, {address?.Floor}</p>
            <p>{address?.Country}, {address?.State}, {address?.City}, {address?.PostalCode}</p>
            <p>Escaleras: {address?.Staircase === 'YES' ? 'SI' : 'NO'}</p>
            <div className="address-actions">
              <IconPencil onClick={() => handleEditAddress(address)} className="edit-icon" />
              <IconPencilMinus onClick={() => handleDeleteAddress(address.AddressID)} className="delete-icon" />
            </div>
          </div>
        )) : <ClipLoader/>}

      </div>
    </div>
  );
}

export default Addresses;
