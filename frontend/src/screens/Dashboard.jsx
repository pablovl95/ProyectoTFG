import React, { useState, useEffect } from 'react';
import "./css/Dashboard.css";

function Dashboard() {
  const [selectedItem, setSelectedItem] = useState("users");
  const [formData, setFormData] = useState([]);
  const [formdataview, setFormdataview] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditable, setIsEditable] = useState(false); // Estado para controlar si el formulario es editable o no
  const itemsPerPage = 10;

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSearch(false); // Reset search state when switching items
  };

  const handleModificarClick = () => {
    console.log("Modificar datos:", formData);
    setIsEditable(true); // Hacer el formulario editable al hacer clic en "Modificar"
  };

  const handleEliminarClick = () => {
    console.log("Eliminar datos:", formData);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/${selectedItem}`);
      const data = await response.json();
      console.log('Search Results:', data);
      setFormData(data || []); // Handle case where data is null or undefined
      setCurrentPage(1);
      setSearch(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    // Reset formData when a new item is selected
    setFormData([]);
  }, [selectedItem]);

  const handleGestionClick = (gestionItem) => {
    setFormData(gestionItem);
    setFormdataview(true);
    setSearch(false);
  };

  const handleInputChange = (e, key) => {
    const newValue = e.target.value;
    // Actualizar el estado formData con el nuevo valor
    setFormData(prevState => ({
      ...prevState,
      [key]: newValue
    }));
  };

  const renderUserCard = () => {
    if (selectedItem === 'users' && formData.length > 0) {
      return formData.map((user, index) => (
        <div key={index} className="user-card" onClick={() => handleGestionClick(user)}>
          <img src={user?.ProfileImageUrl} alt={`${user?.FirstName} ${user?.LastName}`} />
          <h3>{`${user?.FirstName} ${user?.LastName}`}</h3>
          <p><strong>Correo Electrónico:</strong> {user?.Email}</p>
          <p><strong>Teléfono:</strong> {user?.Phone}</p>
          {/* Agrega más campos según la estructura de tus datos de usuario */}
        </div>
      ));
    } else if (selectedItem === 'products' && formData.length > 0) {
      return formData.map((product, index) => (
        <div key={index} className="product-card" onClick={() => handleGestionClick(product)}>
          <img src={product?.ProductImages?.slice(1, -1).split(',')[0]} alt={product?.ProductName} />
          <h3>{product?.ProductName}</h3>
          <p><strong>Precio:</strong> ${product?.Price}</p>
          <p><strong>Descripción:</strong> {product?.ProductDescription}</p>
          {/* Agrega más campos según la estructura de tus datos de producto */}
        </div>
      ));
    } else {
      return null; // Return null if formData is empty or selectedItem is not recognized
    }
  };

  const renderForm = () => {
    return (
      <form className="form-data">
        {Object.entries(formData).map(([key, value], index) => (
          <div key={index} className="form-field">
            <label htmlFor={key}>{key}</label>
            <input
              type="text"
              id={key}
              value={value}
              onChange={(e) => handleInputChange(e, key)}
              readOnly={!isEditable}
            />
          </div>
        ))}
        {isEditable && (
          <>
            <div onClick={handleModificarClick} className="SaveButton">Guardar Cambios</div>
            <div onClick={handleEliminarClick} className="CancelButton">Cancelar</div>
          </>
        )}
        {formdataview && !isEditable && (
          <>
            <div onClick={handleModificarClick} className="modifiedButton">Modificar</div>
            <div onClick={handleEliminarClick} className="DeleteButton">Eliminar</div>
          </>
        )}
      </form>
    );
  };

  return (
    <>
      <h1>Dashboard de Gestión</h1>
      <div className="dashboard-content">
        <div className="sidebar">
          <div onClick={() => handleItemClick('users')}>Usuarios</div>
          <div onClick={() => handleItemClick('products')}>Productos</div>
          <div onClick={() => handleItemClick('orders')}>Pedidos</div>
          <div onClick={() => handleItemClick('Solicitudes de Apertura')}>Solicitudes de Apertura</div>
          <div onClick={() => handleItemClick('Reseñas')}>Reseñas</div>
          <div onClick={() => handleItemClick('Categorías')}>Categorías</div>
          <div onClick={() => handleItemClick('Puntos de Recogida')}>Puntos de Recogida</div>
          <div onClick={() => handleItemClick('Solicitudes de Apertura de Puntos de Recogida')}>Solicitudes de Apertura de Puntos de Recogida</div>
          <div onClick={() => handleItemClick('Noticias')}>Noticias</div>
        </div>
        <div className="content">
          <h2>Datos de búsqueda</h2>
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
            />
            <button onClick={handleSearch}>Buscar</button>
          </div>
          {search && renderUserCard()}
          {formdataview && renderForm()}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
