import React, { useState } from 'react';
import './css/navbar.css';
import { IconMenu2, IconShoppingCart, IconUsers, IconSearch } from '@tabler/icons-react';

function Navbar({ login, register }) {
  const user = false;
  return (
    <div className={"navbar"}>
      <div className={"navbar-default"}>
        <div className="navbar-logo">
          <img src="/Icon.jpeg" alt="Logo" />
        </div>
        <div>Entrega en Sevilla</div>
        <div className="search-bar">
          <div className="search-container">
            <input type="text" placeholder="Buscar..." />
            <IconSearch size={25} color='black' className="search-icon" />
          </div>
        </div>
        <div className="nav-links">
          <div onClick={login}>
            <IconUsers size={25} color='black' />
            {user ? ("Perfil") : ("Iniciar sesión")}
          </div>
          <div>
            <IconShoppingCart size={25} color='black' />
            Cesta
          </div>
        </div>
      </div>

      <div className={"navbar-mobile"}>
        <div className="upperbar">
          <div>
            <IconMenu2 size={25} color='black' />
          </div>
          <div className="navbar-logo">
            <img src="/Icon.jpeg" alt="Logo" />
          </div>
          <div className="nav-links">
            <div onClick={login}>
              <IconUsers size={25} color='black' />
            </div>
            <div>
              <IconShoppingCart size={25} color='black' />
            </div>
          </div>
        </div>
        <div className="search-bar">
          <div className="search-container">
            <input type="text" placeholder="Buscar..." />
            <div className="search-icon">
              <IconSearch size={25} color='black'  />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;