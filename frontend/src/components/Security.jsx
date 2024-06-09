import React, { useEffect, useState } from 'react';
import './css/Security.css';

const Security = ({ userData }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({ ...userData });
    const associatedStores = [
        {
            ShopID: 'a1b2c3d4e5',
            ShopName: 'Tienda Ejemplo 1',
            AddressID: 'address1',
            ShopDescription: 'Tienda de ropa y accesorios',
            OpeningHours: 'Lunes a Viernes: 10:00 - 20:00, Sábados: 10:00 - 14:00',
            Phone: '+34 123 456 789',
            Email: 'tienda1@ejemplo.com',
            TotalSales: 50000
        },
        {
            ShopID: 'f6g7h8i9j0',
            ShopName: 'Tienda Ejemplo 2',
            AddressID: 'address2',
            ShopDescription: 'Tienda de electrónica',
            OpeningHours: 'Lunes a Domingo: 10:00 - 22:00',
            Phone: '+34 987 654 321',
            Email: 'tienda2@ejemplo.com',
            TotalSales: 80000
        },
        {
            ShopID: 'k1l2m3n4o5',
            ShopName: 'Tienda Ejemplo 3',
            AddressID: 'address3',
            ShopDescription: 'Librería y papelería',
            OpeningHours: 'Martes a Sábado: 09:00 - 19:00',
            Phone: '+34 555 111 222',
            Email: 'tienda3@ejemplo.com',
            TotalSales: 35000
        }
    ];
    useEffect(() => {
        console.log(userData);
    }, [userData]);
    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        // Lógica para guardar los datos editados (API call, etc.)
        setEditMode(false);
    };

    const handleDeleteClick = () => {
        // Lógica para eliminar la cuenta del usuario (API call, etc.)
    };

    const handleChange = (field, value) => {
        setEditedData(prevData => ({ ...prevData, [field]: value }));
    };

    return (
        <div className="security-container">
            <h1>Seguridad de la Cuenta</h1>

            <div className="user-info">
                {editMode ? (
                    <>
                        <input type="text" value={editedData.FirstName} placeholder={userData?.FirstName} onChange={(e) => handleChange('FirstName', e.target.value)} />
                        <input type="text" value={editedData.LastName} placeholder={userData?.LastName} onChange={(e) => handleChange('LastName', e.target.value)} />
                        <input type="email" value={editedData.Email} placeholder={userData?.Email} onChange={(e) => handleChange('Email', e.target.value)} />
                        <input type="tel" value={editedData.Phone} placeholder={userData?.Phone} onChange={(e) => handleChange('Phone', e.target.value)} />
                    </>
                ) : (
                    <>
                        <p><strong>Nombre:</strong> {userData?.FirstName}</p>
                        <p><strong>Apellidos:</strong> {userData?.LastName}</p>
                        <p><strong>Email:</strong> {userData?.Email}</p>
                        <p><strong>Teléfono:</strong> {userData?.Phone}</p>
                    </>
                )}
            </div>

            <div className="associated-stores">
                <h2>Tiendas Asociadas</h2>
                {associatedStores.length > 0 ? (
                    <ul>
                        {associatedStores.map(store => (
                            <li key={store.ShopID}>
                                <h3>{store.ShopName}</h3>
                                <p><strong>Descripción:</strong> {store.ShopDescription}</p>
                                <p><strong>Horario:</strong> {store.OpeningHours}</p>
                                <p><strong>Contacto:</strong> {store.Phone} | {store.Email}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tienes tiendas asociadas actualmente.</p>
                )}
            </div>

            <div className="actions">
                {editMode ? (
                    <button onClick={handleSaveClick}>Guardar Cambios</button>
                ) : (
                    <button onClick={handleEditClick}>Editar Datos</button>
                )}
                <button className="delete-button" onClick={handleDeleteClick}>Eliminar Cuenta</button>
            </div>
        </div>
    );
};

export default Security;
