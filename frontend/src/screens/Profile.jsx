import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Security from "../components/Security";
import Orders from "../components/Orders";
import OrdersDetails from "../components/OrdersDetails";
import ProfileDetails from "../components/ProfileDetails";
import Payment from "../components/Payment";
import Workwithus from "./Workwithus";
import Contactus from "../components/Contactus";
import './css/Profile.css';

const Profile = ({ userData, changeUserData }) => {
  const [selectedScreen, setSelectedScreen] = useState('resumen');
  const { id, id2 } = useParams();

  // Actualiza la pantalla seleccionada al cambiar el id
  useEffect(() => {
    setSelectedScreen(id || 'resumen');
  }, [id]);

  // Función para actualizar la pantalla seleccionada
  const handleScreenSelect = (screen) => {
    setSelectedScreen(screen);
  };

  const getNombre = (id) => {
    switch (id) {
      case 'resumen':
        return "Resumen";
      case 'mis-pedidos':
        return "Mis pedidos";
      case 'seguimiento-de-pedidos':
        return "Seguimiento de pedidos";
      case 'mis-cupones':
        return "Mis cupones";
      case 'mis-datos':
        return "Mis datos";
      case 'contactanos':
        return "Contactanos";
      default:
        return "Resumen";
    }
  };

  return (
    <div className="profile-container">
      <Sidebar selectedScreen={selectedScreen} onSelect={handleScreenSelect} /> {/* Pasamos la función de selección al Sidebar */}
      <div className="profile-content">
        <a className='link-active'>Mi cuenta </a>{">"} <a className={id2 ? "link-no-active" : "link-active"} >{getNombre(selectedScreen)}</a> {id2 ? " > " + "Detalles del pedido" : ""}
        {selectedScreen === 'resumen' && <><h2>Ultimos pedidos</h2> <Resumen userData={userData} /></>}
        {selectedScreen === 'mis-pedidos' && <><h2>Mis pedidos</h2><Orders userData={userData} /></>}
        {selectedScreen === 'seguimiento-de-pedidos' && <SeguimientoPedidos />}
        {selectedScreen === 'mis-cupones' && <MisCupones />}
        {selectedScreen === 'mis-datos' && <><h2>Mis datos</h2> <ProfileDetails userData={userData} changeUserData={changeUserData}/></>}
        {selectedScreen === 'contactanos' && <Contactus />}
      </div>
    </div>
  );
};

const Sidebar = ({ selectedScreen, onSelect }) => (
  <div className="sidebar">
    <Link to={`/profile/resumen`} className={selectedScreen === 'resumen' ? 'active' : ''} onClick={() => onSelect('resumen')}>Resumen</Link>
    <Link to={`/profile/mis-pedidos`} className={selectedScreen === 'mis-pedidos' ? 'active' : ''} onClick={() => onSelect('mis-pedidos')}>Mis pedidos</Link>
    <Link to={`/profile/seguimiento-de-pedidos`} className={selectedScreen === 'seguimiento-de-pedidos' ? 'active' : ''} onClick={() => onSelect('seguimiento-de-pedidos')}>Seguimiento de pedidos</Link>
    <Link to={`/profile/mis-cupones`} className={selectedScreen === 'mis-cupones' ? 'active' : ''} onClick={() => onSelect('mis-cupones')}>Mis cupones</Link>
    <Link to={`/profile/mis-datos`} className={selectedScreen === 'mis-datos' ? 'active' : ''} onClick={() => onSelect('mis-datos')}>Mis datos</Link>
    <Link to={`/profile/contactanos`} className={selectedScreen === 'contactanos' ? 'active' : ''} onClick={() => onSelect('contactanos')}>Contactanos</Link>
    <button className="logout-button">Cerrar sesión</button>
  </div>
);

const Resumen = ({ userData }) => (

  <div className='profile-resume-content'>
    <Orders userData={userData} recents={true} />
    <div className="profile-details">
      <h2>Mis datos</h2>

      <div className="user-info">
        <h4>Datos de usuario</h4>
        <div className="separator"></div>
        <p>NOMBRE: {userData.FirstName}</p>
        <p>APELLIDOS: {userData.LastName}</p>
        <p>EMAIL:  {userData.Email}</p>
        <p>TELÉFONO: {userData.Phone == "NULL" ? "No hay datos" : userData.Phone}</p>
        <button className="edit-button">Editar</button>
      </div>
      <div className="shipping-info">
        <h4>Datos de envío</h4>
        <div className="separator"></div>
        <p>DESTINATARIO: pablo vera lopez</p>
        <p>DIRECCIÓN: Real De Abajo, 31, 21600 Valverde Del Camino, Huelva, España</p>
        <button className="edit-button">Editar</button>
      </div>
    </div>
  </div>
);

const SeguimientoPedidos = () => (
  <div>
    <h2>Seguimiento de Pedidos</h2>
    <p>Información sobre el seguimiento de pedidos...</p>
  </div>
);

const MisCupones = () => (
  <div>
    <h2>Mis Cupones</h2>
    <p>Lista de cupones disponibles para el usuario...</p>
  </div>
);




export default Profile;
