import React, { useEffect, useState } from "react";
import "./css/navbar.css";
import { Link, NavLink } from "react-router-dom";
import { IconShoppingCart, IconUsers, IconSearch } from '@tabler/icons-react';
import { auth } from "../auth";

export default function Navbar({ loginView, user, changeCart }) {
  const PrincipalCategories = [
    { id: 1, name: "Frutas" },
    { id: 2, name: "Verduras" },
    { id: 3, name: "Legumbres" },
    { id: 4, name: "Cereales" },
    { id: 5, name: "Carne" },
    { id: 6, name: "Lácteos" },
    { id: 7, name: "Huevos" },
    { id: 8, name: "Productos de colmena" }
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('search');

  useEffect(() => {
    updateCart();
  }, [changeCart]);

  const handleLogout = () => {
    auth.signOut();
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  const Modals = () => {
    setUserMenuOpen(!userMenuOpen);
    loginView();
  };

  const updateCart = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
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
          <div className="navbar-SearchBar-default">
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="search-selector">
              <option value="search">Productos</option>
              <option value="shops">Tiendas</option>
            </select>
            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Link to={`/${searchType}?q=${searchQuery}`} className="IconSearch">
              <IconSearch color="black" />
            </Link>
          </div>
          <div className="icons">
            <NavLink to="/cart" style={{ color: '#FFF' }}>
              <IconShoppingCart size={40} style={{ marginRight: '1rem' }} />
              {cart.length > 0 && (
                <span className="cart-counter">{cart.map(x => x.quantity).reduce((a, b) => a + b, 0)}</span>
              )}
            </NavLink>
            <IconUsers onClick={Modals} style={{ marginRight: '1rem' }} size={40} />
            {userMenuOpen && user && (
              <div className="user-menu">
                <div className="user-menu-bubble">
                  <li><NavLink to="/profile">Mi perfil</NavLink></li>
                  <li><NavLink to="/profile/orders">Mis pedidos</NavLink></li>
                  <li><NavLink to="/profile/addresses">Direcciones</NavLink></li>
                  {user && user.UserType === "administrator" &&
                    <>
                      <li><NavLink to="/dashboard">Dashboard de Gestion</NavLink></li>
                    </>
                  }
                  {user && user.type === "Seller" && <li><NavLink to="/ordersto">Pedidos para recogida</NavLink></li>}
                  <li onClick={handleLogout} style={{ color: 'black' }}>Cerrar sesión</li>
                  <div className="bubble-pointer"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ backgroundColor: "#1d640e", paddingBottom: "1rem", paddingLeft: "1rem" }}>
          <div className="navbar-SearchBar-mobile">
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="search-selector">
              <option value="productos">Productos</option>
              <option value="tiendas">Tiendas</option>
            </select>
            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Link to={`/search?type=${searchType}&q=${searchQuery}`} style={{ textDecoration: 'none', color: 'black' }}>
              <IconSearch color="black" className="IconSearch" />
            </Link>
          </div>
        </div>

        <div className="categories">
          <ul className={menuOpen ? "open" : ""}>
            {PrincipalCategories.map(category => (
              <li key={category.id}>
                <NavLink to={`/search?PrincipalCategoryId=${category.id}`}>{category.name}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}>
          <div className="close-icon">X</div>
          <div className="menu-categories">
            <div className="category-title">CATEGORIAS</div>
            {PrincipalCategories.map(category => (
              <li key={category.id}>
                <NavLink to={`/search?PrincipalCategoryId=${category.id}`}>{category.name}</NavLink>
              </li>
            ))}
            <div className="category-title">CONFIGURACIÓN</div>
            <li>
              <NavLink to="/profile">Perfil</NavLink>
            </li>
            <li>
              <NavLink to="/profile/orders">Mis pedidos</NavLink>
            </li>
            <li>
              <NavLink to="/cart">Carrito</NavLink>
            </li>
          </div>
        </div>}
      </nav>
    </>
  );
}
