import React, { useEffect, useState, useRef } from "react";
import "./css/navbar.css";
import { Link, NavLink } from "react-router-dom";
import { IconShoppingCart, IconUsers, IconSearch } from '@tabler/icons-react';
import { auth } from "../auth";
import UserMenu from "./UserMenu"; 
import { useNavigate } from "react-router-dom";

export default function Navbar({ loginView, user, changeCart, setNotification }) {
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
  const rootRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    updateCart();
  }, [changeCart]);

  const handleLogout = () => {
    auth.signOut();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const Modals = () => {
    setUserMenuOpen(!userMenuOpen);
    loginView();
  };

  const updateCart = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      setCart([]);
    }
  };

  const handleClickOutside = (event) => {
    if (rootRef.current && !rootRef.current.contains(event.target)) {
      setUserMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav ref={rootRef}>
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
            <input type="text" placeholder="Search" id="searchbar-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Link to={`/${searchType}?q=${searchQuery}`} className="IconSearch">
              <IconSearch color="black" id="search"/>
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
              <UserMenu user={user} handleLogout={handleLogout} setUserMenuOpen={setUserMenuOpen} />
            )}
          </div>
        </div>
        <div style={{ backgroundColor: "#1d640e", paddingBottom: "1rem", paddingLeft: "1rem" }}>
          <div className="navbar-SearchBar-mobile" id="searchbar">
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="search-selector">
              <option value="productos">Productos</option>
              <option value="tiendas">Tiendas</option>
            </select>
            <input type="text" id="searchbar-input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Link to={`/search?type=${searchType}&q=${searchQuery}`}  style={{ textDecoration: 'none', color: 'black' }}>
              <IconSearch color="black" id="search" className="IconSearch" />
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
              <NavLink to="/profile/my-orders">Mis pedidos</NavLink>
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
