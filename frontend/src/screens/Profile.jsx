import React from 'react';
import { Link } from 'react-router-dom';
import './css/Profile.css';

const userItems = [
  { id: 1, name: 'Mis pedidos', path: '/profile/orders', url: '/orders.png', description: 'Rastrear, devolver, cancelar un pedido, descargar la factura o volver a comprar' },
  { id: 2, name: 'Inicio de sesión y seguridad', path: '/profile/security', url: '/security.png', description: 'Editar el nombre, el número de teléfono móvil, el correo electrónico y la contraseña' },
  { id: 3, name: 'Mis direcciones', path: '/profile/addresses', url: '/adresses.png', description: 'Editar, eliminar o configurar la dirección predeterminada' },
  { id: 4, name: 'Mis métodos de pago', path: '/profile/payment', url: '/payments.png', description: 'Administrar o añadir métodos de pago y ver tus transacciones' },
  { id: 5, name: 'Trabaja con nosotros', path: '/profile/workwithus', url: '/work.png', description: 'Envíanos una solicitud si lo que deseas es trabajar con nosotros' },
  { id: 6, name: 'Contáctanos', path: '/profile/contact', url: '/contact.png', description: 'Explorar las opciones de autoservicio, los artículos de ayuda o contactarnos' },
];

const transportItems = [
  { id: 7, name: 'Mis entregas', path: '/profile/deliveries', url: '/deliveries.png', description: 'Ver y gestionar las entregas asignadas' },
  { id: 8, name: 'Seleccionar pedido', path: '/profile/select-order', url: '/select-order.png', description: 'Seleccionar un nuevo pedido para entregar' },
  { id: 9, name: 'Historial de entregas', path: '/profile/delivery-history', url: '/delivery-history.png', description: 'Revisar el historial de todas las entregas realizadas' },
];

const storeItems = [
  { id: 10, name: 'Gestionar tienda', path: '/profile/manage-store', url: '/manage-store.png', description: 'Administrar la configuración general de la tienda' },
  { id: 11, name: 'Gestionar noticias', path: '/profile/manage-news', url: '/manage-news.png', description: 'Añadir, editar o eliminar noticias' },
  { id: 12, name: 'Gestionar sección de noticias', path: '/profile/manage-news-section', url: '/manage-news-section.png', description: 'Organizar y configurar la sección de noticias' },
  { id: 13, name: 'Pedidos de la tienda', path: '/profile/store-orders', url: '/store-orders.png', description: 'Ver y gestionar los pedidos realizados en la tienda' },
  { id: 14, name: 'Solicitudes de transportistas', path: '/profile/transport-requests', url: '/transport-requests.png', description: 'Revisar y gestionar las solicitudes de los transportistas' },
];

function ItemProfile({ item }) {
  return (
    <Link to={item.path} className="item-profile">
      <img src={item.url} alt={item.name} />
      <div className="item-profile-info">
        <h2>{item.name}</h2>
        <p>{item.description}</p>
      </div>
    </Link>
  );
}

function ProfileSection({ title, items }) {
  return (
    <div className="profile-section">
      <h2  className='profile-text-left'>{title}</h2>
      <div className="profile-items">
        {items.map((item) => (
          <ItemProfile key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="profile-content">
      <h1 className='profile-text-left'>Mi cuenta</h1>
      <ProfileSection title="Usuario" items={userItems} />
      <ProfileSection title="Transporte" items={transportItems} />
      <ProfileSection title="Tienda" items={storeItems} />
    </div>
  );
}

export default Profile;
