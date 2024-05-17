import React, { useState, useEffect } from 'react';
import { IconAdjustmentsAlt } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import ProductCard from '../components/productCard';
import './css/Search.css';

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

const Search = () => {
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
    MaxRating: '',
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
      MaxRating: params.get('MaxRating') || '',
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
    const searchParams = new URLSearchParams(filters);
    const params = Array.from(searchParams.entries())
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => `${key}=${value}`);
      //console.log(`search?${params.join('&')}`);
    navigate(`/search?${params.join('&')}`);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
      {loading ? (
        <div style={{ padding: "10rem", paddingBottom: "20rem" }}>
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
                <label>Shop ID</label>
                <input
                  type="number"
                  name="ShopID"
                  value={filters.ShopID}
                  onChange={handleFilterChange}
                />
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
              <div className="filter">
                <label>Rating Mínimo</label>
                <input
                  type="number"
                  name="MinRating"
                  value={filters.MinRating}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter">
                <label>Rating Máximo</label>
                <input
                  type="number"
                  name="MaxRating"
                  value={filters.MaxRating}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter">
                <label>Categoría Secundaria</label>
                <input
                  type="number"
                  name="SecundaryCategoryId"
                  value={filters.SecundaryCategoryId}
                  onChange={handleFilterChange}
                />
              </div>
              <button onClick={applyFilters}>Aplicar Filtros</button>
            </div>
            <div className="products-list">
              {currentProducts.map((product) => (
                <ProductCard product={product} key={product.ProductID} />
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
          <div className="pagination">
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
