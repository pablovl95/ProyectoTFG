import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Orders from "../components/profile/Orders";
import OrdersDetails from "../components/profile/OrdersDetails";
import ProfileDetails from "../components/profile/ProfileDetails";
import WorkWithUs from "./Workwithus";
import OrderTracking from "../components/profile/OrderTracking";
import { auth } from "../auth";
import './css/Profile.css';
import { IconChevronsDown, IconChevronsUp } from '@tabler/icons-react';

const Profile = ({ userData, changeUserData, setNotification }) => {
  const [selectedScreen, setSelectedScreen] = useState('summary');
  const navigate = useNavigate();
  const { id, id2 } = useParams();

  useEffect(() => {
    setSelectedScreen(id || 'summary');
  }, [id]);

  const handleScreenSelect = (screen) => {
    if (screen !== selectedScreen) {
      setSelectedScreen(screen);
    }
  };

  const getNombre = (id) => {
    switch (id) {
      case 'summary':
        return "Resumen";
      case 'my-orders':
        return "Mis Pedidos";
      case 'order-tracking':
        return "Seguimiento de Pedidos";
      case 'my-coupons':
        return "Mis Cupones";
      case 'personal-data':
        return "Mis Datos";
      case 'contact-us':
        return "Contactanos";
      case 'work-with-us':
        return "Trabaja con nosotros";
      default:
        return "Resumen";
    }
  };

  return (
    <div className="profile-container">
      <Sidebar selectedScreen={selectedScreen} onSelect={handleScreenSelect} getNombre={getNombre} />
      <div className="profile-content">
        <a className={selectedScreen !== 'summary' ? 'link-no-active' : 'link-active'} onClick={() => navigate("/profile")}>Mi cuenta </a>{" > "}
        <a onClick={() => navigate("/profile/" + selectedScreen)} className={id2 ? 'link-no-active' : 'link-active'}>{getNombre(selectedScreen)}</a>
        {id2 ? <>{" > "} <a className='link-active' onClick={() => navigate("/profile/my-orders/" + id2)}>Detalles del pedido</a></> : ""}
        
        {/* Mostrar el contenido correspondiente a la pantalla seleccionada */}
        {selectedScreen === 'summary' && (
          <>
            <h2>Últimos pedidos</h2>
            <Summary userData={userData} setNotification={setNotification} />
          </>
        )}
        {selectedScreen === 'my-orders' && (
          id2 ? (
            <>
              <h2>Detalles del pedido</h2>
              <OrdersDetails userData={userData} id={id2} setNotification={setNotification} />
            </>
          ) : (
            <>
              <h2>Mis pedidos</h2>
              <Orders userData={userData} setNotification={setNotification} />
            </>
          )
        )}
        {selectedScreen === 'order-tracking' && <OrderTracking userData={userData} setNotification={setNotification} />}
        {selectedScreen === 'my-coupons' && <MyCoupons />}
        {selectedScreen === 'personal-data' && (
          <>
            <h2>Mis datos</h2>
            <ProfileDetails userData={userData} changeUserData={changeUserData} setNotification={setNotification} />
          </>
        )}
        {selectedScreen === 'work-with-us' && <WorkWithUs />}
      </div>
    </div>
  );
};

const Sidebar = ({ selectedScreen, onSelect, getNombre }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <>
      <div className="sidebar">
        <Link to={`/profile/summary`} className={selectedScreen === 'summary' ? 'active' : ''} onClick={() => onSelect('summary')}>Resumen</Link>
        <Link to={`/profile/my-orders`} className={selectedScreen === 'my-orders' ? 'active' : ''} onClick={() => onSelect('my-orders')}>Mis pedidos</Link>
        <Link to={`/profile/order-tracking`} className={selectedScreen === 'order-tracking' ? 'active' : ''} onClick={() => onSelect('order-tracking')}>Seguimiento de pedidos</Link>
        <Link to={`/profile/my-coupons`} className={selectedScreen === 'my-coupons' ? 'active' : ''} onClick={() => onSelect('my-coupons')}>Mis cupones</Link>
        <Link to={`/profile/personal-data`} className={selectedScreen === 'personal-data' ? 'active' : ''} onClick={() => onSelect('personal-data')}>Mis datos</Link>
        <Link to={`/profile/work-with-us`} className={selectedScreen === 'work-with-us' ? 'active' : ''} onClick={() => onSelect('work-with-us')}>Trabaja con nosotros</Link>
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
      </div>
      <div className='sidebar-mobile'>
        <div className="sidebar-button" onClick={() => setOpenSidebar(!openSidebar)}>
          {openSidebar ? <a>Cerrar </a> : <a>{getNombre(selectedScreen)}</a>}
          {openSidebar ? <IconChevronsUp /> : <IconChevronsDown />}
        </div>
        {openSidebar && (
          <div className={`sidebar-mobile`}>
            <Link to={`/profile/summary`} className={selectedScreen === 'summary' ? 'sidebar-toggle active' : 'sidebar-toggle'} onClick={() => { onSelect('summary'); setOpenSidebar(!openSidebar); }}>Resumen</Link>
            <Link to={`/profile/my-orders`} className={selectedScreen === 'my-orders' ? 'sidebar-toggle active' : 'sidebar-toggle'} onClick={() => { onSelect('my-orders'); setOpenSidebar(!openSidebar); }}>Mis pedidos</Link>
            <Link to={`/profile/order-tracking`} className={selectedScreen === 'order-tracking' ? 'sidebar-toggle active' : 'sidebar-toggle'} onClick={() => { onSelect('order-tracking'); setOpenSidebar(!openSidebar); }}>Seguimiento de pedidos</Link>
            <Link to={`/profile/my-coupons`} className={selectedScreen === 'my-coupons' ? 'sidebar-toggle active' : 'sidebar-toggle'} onClick={() => { onSelect('my-coupons'); setOpenSidebar(!openSidebar); }}>Mis cupones</Link>
            <Link to={`/profile/personal-data`} className={selectedScreen === 'personal-data' ? 'sidebar-toggle active' : 'sidebar-toggle'} onClick={() => { onSelect('personal-data'); setOpenSidebar(!openSidebar); }}>Mis datos</Link>
            <Link to={`/profile/contact-us`} className={selectedScreen === 'contact-us' ? 'sidebar-toggle active' : 'sidebar-toggle'} onClick={() => { onSelect('contact-us'); setOpenSidebar(!openSidebar); }}>Contactanos</Link>
            <Link to={`/profile/work-with-us`} className={selectedScreen === 'work-with-us' ? 'sidebar-toggle active' : 'sidebar-toggle'} onClick={() => { onSelect('work-with-us'); setOpenSidebar(!openSidebar); }}>Trabaja con nosotros</Link>
            <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </>
  );
}

const Summary = ({ userData, setNotification }) => {
  const [userAddress, setUserAddress] = useState(null);
  const navigate = useNavigate();
  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/addresses/${userData.UserID}`)
      .then(response => response.json())
      .then(data => {
        const defaultAddress = data.find(address => address.DefaultAddress === 1);
        if (defaultAddress) {
          setUserAddress(defaultAddress);
        } else if (data.length > 0) {
          setUserAddress(data[0]);
        }
      })
      .catch(error => setNotification({ type: 'error', message: "No se han podido cargar las direcciones" }));
  }, [userData.UserID, backendUrl, setNotification]);

  return (
    <div className='profile-resume-content'>
      <Orders userData={userData} recents={true} />
      <div className="profile-data-user-details">
        <h2>Mis datos</h2>

        <div className="profile-user-info">
          <h4>Datos de usuario</h4>
          <div className="separator" style={{ marginBottom: "1rem" }}></div>
          NOMBRE:
          <p>{userData.FirstName}</p>
          APELLIDOS:
          <p>{userData.LastName}</p>
          EMAIL:
          <p>{userData.Email}</p>
          TELÉFONO:
          <p>{userData.Phone === "NULL" ? "No hay datos" : userData.Phone}</p>
          <button className="edit-button" onClick={() => navigate("/profile/personal-data")}>Editar</button>
        </div>
        <div className="profile-shipping-info">
          <h4>Datos de envío</h4>
          <div className="separator" style={{ marginBottom: "1rem" }}></div>
          DESTINATARIO:
          <p>{userData.FirstName} {userData.LastName}</p>
          DIRECCIÓN:
          {userAddress ? (
            <>
              <p>{userAddress?.AddressTitle}</p>
              <p>{userAddress?.AddressLine}, {userAddress?.AddressNumber}</p>
              <p>{userAddress?.City}, {userAddress?.Province}, {userAddress?.Country}</p>
              <button className="edit-button" onClick={() => navigate("/profile/personal-data")}>Editar</button>
            </>
          ) : (
            <>
              <p>Aún no hay ninguna dirección añadida.</p>
              <button className="edit-button" onClick={() => navigate("/profile/personal-data")}>Añadir Dirección</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MyCoupons = () => (
  <div>
    <h2>Mis Cupones</h2>
    <p>Lista de cupones disponibles para el usuario...</p>
  </div>
);

export default Profile;
