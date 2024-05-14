import React, { useEffect, useState } from "react";
import "./css/navbar.css";
import { Link, NavLink } from "react-router-dom";
import { IconMenu2, IconShoppingCart, IconUsers, IconSearch } from '@tabler/icons-react';
import { auth } from "../auth";

export default function Navbar({ loginView, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleLogout = () => {
    auth.signOut();
    setUserMenuOpen(false);
    setMenuOpen(false);
  }

  const Modals = () => {
    setUserMenuOpen(!userMenuOpen);
    loginView();
  };

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
            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Link to={`/search?q=${searchQuery}`} className="IconSearch">
              <IconSearch color="black"  />
            </Link>
          </div>
          <div className="icons">
            <NavLink to="/cart" style={{ color: '#FFF' }}>
              <IconShoppingCart size={40} style={{ marginRight: '1rem' }} />
              {cart.length > 0 && (
                <span className="cart-counter">{cart.length}</span>
              )}
            </NavLink>
            <IconUsers onClick={Modals} style={{ marginRight: '1rem' }} size={40} />
            {userMenuOpen && user && (
              <div className="user-menu">

                <div className="user-menu-bubble">

                  <li><NavLink to="/profile">Mi perfil</NavLink></li>
                  <li><NavLink to="/orders">Mis pedidos</NavLink></li>
                  <li><NavLink to="/adresses">Direcciones</NavLink></li>
                  {user && user.type == "Administrator" &&
                    <>
                      <li><NavLink to="/dashboard?gestion">Usuarios</NavLink></li>
                      <li><NavLink to="/dashboard?gestion">Productos</NavLink></li>
                      <li><NavLink to="/pickuporders">Dashboard de Gestion</NavLink></li>
                      <li><NavLink to="/ordersto">Pedidos para recogida</NavLink></li>
                    </>
                  }
                  {user && user.type == "Sellet" && <li><NavLink to="/ordersto">Pedidos para recogida</NavLink></li>}
                  <li onClick={handleLogout} style={{ color: 'black' }}>Cerrar sesión</li>
                  <div className="bubble-pointer"></div>

                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ backgroundColor: "#1d640e", paddingBottom: "1rem", paddingLeft: "1rem" }}>
          <div className="SearchBar-mobile">
            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Link to={`/search?q=${searchQuery}`} style={{ textDecoration: 'none', color: 'black' }}>
              <IconSearch color="black" className="IconSearch" />
            </Link>
          </div>
        </div>

        <div className="categories">
          <ul className={menuOpen ? "open" : ""}>
            <li>
              <NavLink to="/search?PrincipalCategoryId=1">Frutas</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=2">Verduras</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=3">Legumbres</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=4">Cereales</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=5">Carne</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=6">Lácteos</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=7">Huevos</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=8">Productos de colmena</NavLink>
            </li>
          </ul>
        </div>

        {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}>
          <div className="close-icon">X</div>
          <div className="menu-categories">
            <div className="category-title">CATEGORIAS</div>
            <li>
              <NavLink to="/search?PrincipalCategoryId=1">Frutas</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=2">Verduras</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=3">Legumbres</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=4">Cereales</NavLink>
            </li>
            <Link to="/search?PrincipalCategoryId=5">
              <li>
                <NavLink to="/search?PrincipalCategoryId=5">Carne</NavLink>
              </li>
            </Link>
            <li>
              <NavLink to="/search?PrincipalCategoryId=6">Lácteos</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=7">Huevos</NavLink>
            </li>
            <li>
              <NavLink to="/search?PrincipalCategoryId=8">Productos de colmena</NavLink>
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
          </div>
        </div>}
      </nav>
    </>
  );
};
