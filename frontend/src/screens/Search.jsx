import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IconAdjustmentsAlt } from '@tabler/icons-react';
import { ClipLoader } from 'react-spinners';
import ProductCard from '../components/ProductCard';
import './css/Search.css';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [FilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    customerRating: ''
  });
  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const productsPerPage = 10;
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryID = params.get('PrincipalCategoryId');
    if (categoryID) {
      const category = PrincipalCategories.find(cat => cat.id === parseInt(categoryID))?.name.toLowerCase() || '';
      setFilters({ ...filters, category });
    }
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
      setFilteredProducts(data);
      setProductCount(data.length);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const { category, minPrice, maxPrice, customerRating } = filters;
    let filtered = products;

    if (category) {
      filtered = filtered.filter(product => product.PrincipalCategoryName.toLowerCase() === category.toLowerCase());
    }

    if (minPrice) {
      filtered = filtered.filter(product => product.Price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(product => product.Price <= parseFloat(maxPrice));
    }

    if (customerRating) {
      filtered = filtered.filter(product => product.Rating >= parseInt(customerRating));
    }

    setFilteredProducts(filtered);
    setProductCount(filtered.length);
    setCurrentPage(1);

    // Si todos los filtros están vacíos, hacer una llamada nueva a la base de datos
    if (!category && !minPrice && !maxPrice && !customerRating) {
      fetchProducts();
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value.toLowerCase();
    const categoryID = PrincipalCategories.find(cat => cat.name.toLowerCase() === selectedCategory)?.id;

    if (selectedCategory === "") {
      // Si se selecciona "Todas", limpiar el parámetro de categoría en la URL
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('PrincipalCategoryId');
      navigate(`?${searchParams.toString()}`);
    } else {
      if (categoryID) {
        navigate(`/search?PrincipalCategoryId=${categoryID}`);
      } else {
        setFilters({
          ...filters,
          category: selectedCategory
        });
        applyFilters();
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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
          {productCount} resultados para "Busqueda"
          <div className="product-list-container">
            <div className="filters-column">
              <h2>Filtros</h2>
              <label>
                Categoría:
                <select name="category" value={filters.category} onChange={handleCategoryChange}>
                  <option value="">Todas</option>
                  {PrincipalCategories.map(category => (
                    <option key={category.id} value={category.name.toLowerCase()}>
                      {category.name}
                    </option>
                  ))}
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
              <select name="customerRating" value={filters.customerRating} onChange={handleFilterChange}>
                <option value="">Cualquiera</option>
                <option value="5">5 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="2">2 estrellas</option>
                <option value="1">1 estrella</option>
              </select>
              <button onClick={applyFilters}>Aplicar filtros</button>
            </div>
            <div className="filters-options"></div>
            <div className="filters" onClick={() => setFilterVisible(!FilterVisible)}>
              <div className="filters-content">
                <IconAdjustmentsAlt />
                Filtros
              </div>
              <a>{productCount} productos</a>
            </div>
            <div className="products-list">
              {currentProducts.map((product) => (
                <ProductCard product={product} key={product.ProductID} />
              ))}
            </div>
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
