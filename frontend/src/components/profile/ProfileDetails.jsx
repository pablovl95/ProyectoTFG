import React, { useState, useEffect } from 'react';
import UserData from './UserData';
import Addresses from '../Addresses';
import '../css/profile/ProfileDetails.css';

const ProfileDetails = ({ userData, changeUserData }) => {
    const [selectedOption, setSelectedOption] = useState('datos');
    let ContentComponent;
    switch (selectedOption) {
        case 'datos':
            ContentComponent = <UserData userData={userData} changeUserData={changeUserData} />;
            break;
        case 'direcciones':
            ContentComponent = <Addresses userData={userData} Screen={"data"}/>;
            break;
        case 'metodosPago':
            ContentComponent = <MetodosPago userData={userData} />;
            break;
        default:
            ContentComponent = null;
    }

    return (
        <div className="profile-details">
            <div className="profile-details-header-nav">
                <a onClick={() => setSelectedOption('datos')}>Datos</a>
                <a onClick={() => setSelectedOption('direcciones')}>Direcciones</a>
                <a onClick={() => setSelectedOption('metodosPago')}>Mis métodos de pago</a>
            </div>
            <div className="profile-details-content">
                {ContentComponent}
            </div>
        </div>
    );
};



const MetodosPago = () => (
    <div className="profile-details-user-info">
        <h4>Mis métodos de pago</h4>
        <div className="separator"></div>
        {/* Agrega aquí la lógica para mostrar los métodos de pago */}
    </div>
);

export default ProfileDetails;
