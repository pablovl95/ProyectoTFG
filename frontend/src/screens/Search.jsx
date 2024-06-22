import React, { useState, useEffect } from 'react';
import { IconAdjustmentsAlt, IconX } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import ProductCard from '../components/productCard';
import './css/Search.css';
import { buildURLSearchParams, renderStars } from '../utils/utils';

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

const Search = ({ changeCart, setNotification }) => {
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    q: '',
    PrincipalCategoryId: '',
    ShopID: '',
    MinPrice: '',
    MaxPrice: '',
    MinRating: '',
    SecundaryCategoryId: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      q: params.get('q') || '',
      PrincipalCategoryId: params.get('PrincipalCategoryId') || '',
      ShopID: params.get('ShopID') || '',
      MinPrice: params.get('MinPrice') || '',
      MaxPrice: params.get('MaxPrice') || '',
      MinRating: params.get('MinRating') || '',
      SecundaryCategoryId: params.get('SecundaryCategoryId') || ''
    });
    fetchProducts();
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      const response = await fetch(`${backendUrl}/api/v1/products?${params}`);
      let data = [];
      if (response.ok) {
        data = await response.json();

      }
      setProducts(data);
      setProductCount(data.length);
    } catch (error) {
      setNotification({ type: 'error', message: "Ha ocurrido un problema con la busqueda. Reinicia la pagina o vuelve mas tarde" });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    const params = buildURLSearchParams(filters);
    navigate(`/search?${params}`);
    setFilterVisible(false); // Hide the modal after applying filters
  };

  const handleStarClick = (rating) => {
    setFilters({
      ...filters,
      MinRating: rating
    });
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
      {loading ? (
        <div style={{ padding: "10rem", paddingBottom: "20rem", width: "10%", margin: "auto" }}>
          <ClipLoader
            color={"green"}
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          {productCount} resultados para esta búsqueda
          <div className="product-list-container">
            <div className={`filter-container ${filterVisible ? 'visible' : ''}`}>
              <h2>Filtros de busqueda</h2>
              <div className="filter">
                <label>Buscar</label>
                <input
                  type="text"
                  name="q"
                  value={filters.q}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter">
                <label>Categoría Principal</label>
                <select
                  name="PrincipalCategoryId"
                  value={filters.PrincipalCategoryId}
                  onChange={handleFilterChange}
                >
                  <option value="">Seleccionar categoría</option>
                  {PrincipalCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter">
                <label>Categoría Secundaria</label>
                <input
                  type="text"
                  name="SecundaryCategoryId"
                  value={filters.SecundaryCategoryId}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter">
                <label>Valoración</label>
                <div className="star-rating">
                  {renderStars(filters.MinRating, handleStarClick)}
                </div>
              </div>
              <div className="filter">
                <label>Precio Mínimo</label>
                <input
                  type="number"
                  name="MinPrice"
                  value={filters.MinPrice}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter">
                <label>Precio Máximo</label>
                <input
                  type="number"
                  name="MaxPrice"
                  value={filters.MaxPrice}
                  onChange={handleFilterChange}
                />
              </div>

              <button onClick={applyFilters}>Aplicar Filtros</button>
              <button className="close-modal" onClick={() => setFilterVisible(false)}>
                <IconX />
              </button>
            </div>
            <div className="products-list">
              {currentProducts.map((product) => (
                <ProductCard product={product} key={product.ProductID} changeCart={changeCart} />
              ))}
            </div>
          </div>
          <div className="filters-options"></div>
          <div className="filters" onClick={() => setFilterVisible(!filterVisible)}>
            <div className="filters-content">
              <IconAdjustmentsAlt />
              Filtros
            </div>
            <a>{productCount} productos</a>
          </div>
          <div className="search-pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Search;
