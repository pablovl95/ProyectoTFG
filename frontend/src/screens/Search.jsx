import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productCard'; // Asumiendo que tienes un componente ProductCard para mostrar cada producto
import './css/Search.css';
import { IconAdjustmentsAlt } from '@tabler/icons-react';

const Search = () => {
  const [products, setProducts] = useState([]);
  const productCount = products.length;
  const [FilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const totalPages = Math.ceil(products.length / productsPerPage);

const fetchProducts = async () => {
  const dat = fetch('http://localhost:5000/api/v1/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
};

useEffect(() => {
  fetchProducts();
}, []);

  const applyFilters = () => {
  };

  // Función para manejar cambios en los filtros
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Función para cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculamos el índice del primer y último producto de la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products?.slice(indexOfFirstProduct, indexOfLastProduct);


  return (
    <>
      {productCount} resultados para "Busqueda"
      <div className="product-list-container">
        <div className="filters-column">
          <h2>Filtros</h2>
          <label>
            Categoría:
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">Todas</option>
              <option value="">Patatas</option>
              <option value="">Carne</option>
              <option value="">Leche</option>
              <option value="">Verduras</option>
            </select>
          </label>
          <label>
            Rango de precios:
            <div className="row space-between">
              <div>
                <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />
              </div>
              Hasta
              <div>
                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />
              </div>
            </div>
          </label>
          Opiniones de clientes:
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">Cualquiera</option>
            <option value="">5 estrellas</option>
            <option value="">4 estrellas</option>
            <option value="">3 estrellas</option>
            <option value="">2 estrellas</option>
            <option value="">1 estrella</option>
          </select>
          <button onClick={applyFilters}>Aplicar filtros</button>
        </div>
        <div className="filters-options">

        </div>
        <div className="filters" onClick={() => setFilterVisible(!FilterVisible)}>
          <div className="filters-content">
            <IconAdjustmentsAlt />
            Filtros
          </div>
          <a>{productCount} productos</a>
        </div>
        <div className="products-list">
          {currentProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>


      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
        ))}
      </div>
    </>
  );
};

export default Search;
