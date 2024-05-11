import React, { useEffect, useState } from "react";
import "./css/navbar.css";
import { Link, NavLink } from "react-router-dom";
import { IconMenu2, IconShoppingCart, IconUsers, IconSearch } from '@tabler/icons-react';

export default function Navbar({ login }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav>
        <div className="nav">
          <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <Link to="/" className="title">
            EcoShop
          </Link>
          <div className="SearchBar-default">
            <input type="text" placeholder="Search" />
            <IconSearch color="black" className="IconSearch" />
          </div>
          <div className="icons">
            <IconShoppingCart size={40} style={{ marginRight: '1rem' }} />
            <IconUsers onClick={login} style={{ marginRight: '1rem' }} size={40} />
          </div>
        </div>
        <div style={{ backgroundColor: "#1d640e", paddingBottom: "1rem", paddingLeft: "1rem" }}>
          <div className="SearchBar-mobile">
            <input type="text" placeholder="Search" />
            <IconSearch color="black" className="IconSearch" />
          </div>
        </div>

        <div className="categories">
          <ul className={menuOpen ? "open" : ""}>
            <li>
              <NavLink to="search?principal_category=frutas">Frutas</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=verduras">Verduras</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=legumbres">Legumbres</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=cereales">Cereales</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=carne">Carne</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=lacteos">Lácteos</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=huevos">Huevos</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=productos-colmena">Productos de colmena</NavLink>
            </li>
          </ul>
        </div>

        {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}>
          <div className="close-icon">X</div>
          <div className="menu-categories">
            <div className="category-title">CATEGORIAS</div>
            <li>
              <NavLink to="search?principal_category=frutas">Frutas</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=verduras">Verduras</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=legumbres">Legumbres</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=cereales">Cereales</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=carne">Carne</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=lacteos">Lácteos</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=huevos">Huevos</NavLink>
            </li>
            <li>
              <NavLink to="search?principal_category=productos-colmena">Productos de colmena</NavLink>
            </li>
            <div className="category-title">CONFIGURACIÓN</div>
            <li>
              <NavLink to="/profile">Perfil</NavLink>
            </li>
            <li>
              <NavLink to="/orders">Mis pedidos</NavLink>
            </li>
            <li>
              <NavLink to="/cart">Carrito</NavLink>
            </li>
            <li>
              <NavLink to="/login">Iniciar sesión</NavLink>
            </li>
            <li>
              <NavLink to="/register">Registrarse</NavLink>
            </li>
          </div>
        </div>}
    </nav>
    </>
  );
};
