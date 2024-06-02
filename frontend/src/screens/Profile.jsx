import React from 'react';
import { Link } from 'react-router-dom';
import './css/Profile.css';
const items = [
  {id:1,
    name: 'Mis pedidos',
    path: '/profile/orders',
    url: '/orders.png',
    description: 'Rastrear, devolver, cancelar un pedido, descargar la factura o volver a comprar'
  },
  {id:2,
    name: 'Inicio de sesión y seguridad',
    path: '/profile/security',
    url: '/security.png',
    description:'Editar el nombre, el número de teléfono móvil, el correo electrónico y la contraseña',
  },
  {id:3,
    name: 'Mis direcciones',
    path: '/profile/addresses',
    url: '/adresses.png',
    description:'Editar, eliminar o configurar la dirección predeterminada',
  },
  {id:4,
    name: 'Mis metodos de pago',
    path: '/profile/payment',
    url: '/payments.png',
    description:'Administrar o añadir métodos de pago y ver tus transacciones',
  },
  {id:5,
    name: 'Trabaja con nosotros',
    path: '/profile/work',
    url: '/work.png',
    description:'Envianos una solicitud si lo que deseas es trabajar con nosotros',
  },
  {id:6,
    name: 'Contactanos',
    path: '/profile/contact',
    url: '/contact.png',
    description:'Explorar las opciones de autoservicio, los artículos de ayuda o contactarnos',
  }
];
function ItemProfile({ item }) {
  return (
    <Link to={item.path} className="item-profile">
      <img src={item.url}></img>
      <div className="item-profile-info">
        <h2>{item.name}</h2>
        <p>{item.description}</p>
      </div>
    </Link>
  );
}
function Profile() {
  return (
    <div className="profile-content">
      <h1>Mi cuenta</h1>
      <div className="profile-items">
        {items.map((item) => (
          <ItemProfile key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}



export default Profile;
