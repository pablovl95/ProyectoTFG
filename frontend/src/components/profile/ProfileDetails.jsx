import React, { useState, useEffect } from 'react';
import UserData from './UserData';
import Addresses from '../Addresses';
import Payment from './Payment';
import '../css/profile/ProfileDetails.css';

const ProfileDetails = ({ userData, changeUserData, setNotification }) => {
    const [selectedOption, setSelectedOption] = useState('datos');
    let ContentComponent;
    switch (selectedOption) {
        case 'datos':
            ContentComponent = <UserData userData={userData} changeUserData={changeUserData} setNotification={setNotification}/>;
            break;
        case 'direcciones':
            ContentComponent = <Addresses userData={userData} Screen={"data"}/>;
            break;
        case 'metodosPago':
            ContentComponent = <Payment userData={userData} Screen={"Details"}/>;
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


export default ProfileDetails;
