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
                            <label htmlFor="AddressTitle">Título de dirección</label>
                            <input type="text" id="AddressTitle" name="AddressTitle" required defaultValue={emptyAddress.AddressTitle} />
                        </div>
                        <div className='form-row-data'>
                            <div>
                                <label htmlFor="FirstName">Nombre</label>
                                <input type="text" id="FirstName" name="FirstName" required defaultValue={emptyAddress.FirstName} />
                            </div>
                            <div>
                                <label htmlFor="LastName">Apellido</label>
                                <input type="text" id="LastName" name="LastName" required defaultValue={emptyAddress.LastName} />
                            </div>
                            <div>
                                <label htmlFor="Phone">Teléfono</label>
                                <input type="text" id="Phone" name="Phone" required defaultValue={emptyAddress.Phone} />
                            </div>
                        </div>
                        <div className='form-row-data'>
                            <div>
                                <label htmlFor="AddressLine">Dirección</label>
                                <input type="text" id="AddressLine" name="AddressLine" required defaultValue={emptyAddress.AddressLine} />
                            </div>
                            <div>
                                <label htmlFor="AddressNumber">Número</label>
                                <input type="text" id="AddressNumber" name="AddressNumber" required defaultValue={emptyAddress.AddressNumber} />
                            </div>
                            <div>
                                <label htmlFor="PostalCode">Código Postal</label>
                                <input type="text" id="PostalCode" name="PostalCode" required defaultValue={emptyAddress.PostalCode} />
                            </div>
                        </div>
                        <div className='form-row-data'>
                            <div>
                                <label htmlFor="City">Ciudad</label>
                                <input type="text" id="City" name="City" required defaultValue={emptyAddress.City} />
                            </div>
                            <div>
                                <label htmlFor="Province">Provincia</label>
                                <input type="text" id="Province" name="Province" required defaultValue={emptyAddress.Province} />
                            </div>
                            <div>
                                <label htmlFor="Country">País</label>
                                <input type="text" id="Country" name="Country" required defaultValue={emptyAddress.Country} />
                            </div>
                        </div>
                        <div className="form-buttons">
                            <button type="button" onClick={closeForm} style={{backgroundColor:"red"}}>Cancelar</button>
                            <button type="submit" >Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddressesForm;
