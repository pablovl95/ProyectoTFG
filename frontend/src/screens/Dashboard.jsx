import React, { useState, useEffect } from 'react';
import "./css/Dashboard.css";

function Dashboard() {
  const [selectedItem, setSelectedItem] = useState("users");
  const [formData, setFormData] = useState([]);
  const [formdataview, setFormdataview] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditable, setIsEditable] = useState(false);
  const itemsPerPage = 10;

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSearch(false); // Reset search state when switching items
    setFormdataview(false); // Reset formdataview when switching items
    setFormData([]); // Clear formData immediately
  };

  const handleModificarClick = () => {
    setIsEditable(true); // Hacer el formulario editable al hacer clic en "Modificar"
  };

  const handleEliminarClick = () => {

  };
const handleSaveClick = () => {
    setIsEditable(false); // Hacer el formulario no editable al hacer clic en "Guardar cambios"
};
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/${selectedItem}`);
      const data = await response.json();
      setFormData(data || []); 
      setCurrentPage(1);
      setSearch(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
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
    if (search) {
      if (selectedItem === 'users' && formData.length > 0) {
        return formData.map((user, index) => (
          <div key={index} className="dashboard-user-card" onClick={() => handleGestionClick(user)}>
            <img src={user?.ProfileImageUrl} alt={`${user?.FirstName} ${user?.LastName}`} />
            <h3>{`${user?.FirstName} ${user?.LastName}`}</h3>
            <p><strong>Correo Electrónico:</strong> {user?.Email}</p>
            <p><strong>Teléfono:</strong> {user?.Phone}</p>
          </div>
        ));
      } else if (selectedItem === 'products' && formData.length > 0) {
        return formData.map((product, index) => (
          <div key={index} className="dashboard-product-card" onClick={() => handleGestionClick(product)}>
            <img src={"data:image/png;base64," + product?.ImageContent} alt={product?.ProductName} />
            <h3>{product?.ProductName}</h3>
            <p><strong>Precio:</strong> ${product?.Price}</p>
            <p><strong>Descripción:</strong> {product?.ProductDescription}</p>
          </div>
        ));
      }
    }
  };

  const renderForm = () => {
    return (
      <form className="dashboard-form-data">
        {Object.entries(formData).map(([key, value], index) => (
          <div key={index} className="dashboard-form-field">
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
            <div onClick={handleSaveClick} className="dashboard-SaveButton">Guardar Cambios</div>
            <div onClick={handleEliminarClick} className="dashboard-CancelButton">Cancelar</div>
          </>
        )}
        {formdataview && !isEditable && (
          <>
            <div onClick={handleModificarClick} className="dashboard-modifiedButton">Modificar</div>
            <div onClick={handleEliminarClick} className="dashboard-DeleteButton">Eliminar</div>
          </>
        )}
      </form>
    );
  };

  return (
    <>
      <h1>Dashboard de Gestión</h1>
      <div className="dashboard-contents">
        <div className="dashboard-sidebar">
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
        <div className="dashboard-content">
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
          {renderUserCard()}
          {formdataview && renderForm()}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
