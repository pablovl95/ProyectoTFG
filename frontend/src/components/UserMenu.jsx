import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

export default function UserMenu({ user, handleLogout, setUserMenuOpen }) {
  const rootRef = useRef(null);

  const handleClickOutside = (event) => {
    if (rootRef.current && !rootRef.current.contains(event.target)) {
      setUserMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    setUserMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setUserMenuOpen]);

  return (
    <div className="user-menu" ref={rootRef}>
      <div className="user-menu-bubble">
        <li><NavLink to="/profile" onClick={handleLinkClick}>Mi perfil</NavLink></li>
        <li><NavLink to="/profile/my-orders" onClick={handleLinkClick}>Mis pedidos</NavLink></li>
        <li><NavLink to="/profile/work-with-us" onClick={handleLinkClick}>Trabaja con nosotros</NavLink></li>
        {user && user.UserType === "administrator" &&
          <li><NavLink to="/dashboard" onClick={handleLinkClick}>Dashboard de Gestion</NavLink></li>
        }
        {user && user.type === "Seller" && <li><NavLink to="/ordersto" onClick={handleLinkClick}>Pedidos para recogida</NavLink></li>}
        <li className="user-menu-logout" onClick={() => { handleLogout(); handleLinkClick(); }} style={{ color: 'black' }}>Cerrar sesión</li>
        <div className="bubble-pointer"></div>
      </div>
    </div>
  );
}
