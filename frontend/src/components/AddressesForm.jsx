import React from 'react';
import { IconCircleX } from '@tabler/icons-react';
import './css/AddressesForm.css';

const AddressesForm = ({ 
    emptyAddress, 
    handleFormSubmit, 
    closeForm, 
    editingIndex 
}) => {
    return (
        <div className="overlay">
            <div className="address-form">
                <div className="address-form-header" onClick={closeForm}>
                    <h3>{editingIndex !== null ? 'Editar dirección' : 'Añadir dirección'}</h3>
                    <IconCircleX color='white' style={{ padding: "1rem" }} />
                </div>
                <div className="address-form-container">
                    <form onSubmit={handleFormSubmit}>
                        <div className='form-title'>
                            <label htmlFor="title">Título de dirección</label>
                            <input type="text" id="title" name="title" required defaultValue={emptyAddress.title} />
                        </div>
                        <div className='form-row-data'>
                            <div>
                                <label htmlFor="firstName">Nombre</label>
                                <input type="text" id="firstName" name="firstName" required defaultValue={emptyAddress.FirstName} />
                            </div>
                            <div>
                                <label htmlFor="lastName">Apellido</label>
                                <input type="text" id="lastName" name="lastName" required defaultValue={emptyAddress.LastName} />
                            </div>
                            <div>
                                <label htmlFor="phone">Teléfono</label>
                                <input type="text" id="phone" name="phone" required defaultValue={emptyAddress.Phone} />
                            </div>
                        </div>
                        <div className='form-row-data'>
                            <div>
                                <label htmlFor="addressLine">Dirección</label>
                                <input type="text" id="addressLine" name="addressLine" required defaultValue={emptyAddress.AddressLine} />
                            </div>
                            <div>
                                <label htmlFor="addressNumber">Número</label>
                                <input type="text" id="addressNumber" name="addressNumber" required defaultValue={emptyAddress.AddressNumber} />
                            </div>
                            <div>
                                <label htmlFor="postalCode">Código Postal</label>
                                <input type="text" id="postalCode" name="postalCode" required defaultValue={emptyAddress.PostalCode} />
                            </div>
                        </div>
                        <div className='form-row-data'>
                            <div>
                                <label htmlFor="city">Ciudad</label>
                                <input type="text" id="city" name="city" required defaultValue={emptyAddress.City} />
                            </div>
                            <div>
                                <label htmlFor="province">Provincia</label>
                                <input type="text" id="province" name="province" required defaultValue={emptyAddress.Province} />
                            </div>
                            <div>
                                <label htmlFor="country">País</label>
                                <input type="text" id="country" name="country" required defaultValue={emptyAddress.Country} />
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
    );
};

export default AddressesForm;
