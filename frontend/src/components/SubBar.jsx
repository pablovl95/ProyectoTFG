import React from 'react';
import { Link } from 'react-router-dom';
import './css/SubBar.css';

const SubBar = () => {
  return (
    <div className="Categorys-bar">
      <Link to="/Search/Vegetales">
        <a> Vegetales </a>
      </Link>
      <Link to="/Search/Frutas">
        <a> Frutas </a>
      </Link>
      <Link to="/Search/Carne">
        <a> Carne </a>
      </Link>
      <Link to="/Search/Lácteos">
        <a> Lácteos </a>
      </Link>
      <Link to="/Search/Bebidas">
        <a> Bebidas </a>
      </Link>
      <Link to="/Search/Aperitivos">
        <a> Aperitivos </a>
      </Link>
      <Link to="/Search/Panadería">
        <a> Panadería </a>
      </Link>
      <Link to="/Search/ProductosDelMar">
        <a> Productos del Mar </a>
      </Link>
      <Link to="/Search/CuidadoPersonal">
        <a> Cuidado Personal </a>
      </Link>
      <Link to="/Search/Hogar">
        <a> Hogar </a>
      </Link>
    </div>
  );
}

export default SubBar;
