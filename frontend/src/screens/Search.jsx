import React, { useState, useEffect } from 'react';
import { IconAdjustmentsAlt } from '@tabler/icons-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import ProductCard from '../components/productCard';
import './css/Search.css';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [FilterVisible, setFilterVisible] = useState(false);
  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
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
          <div className="filter-container">
            Filtros
          </div>
            <div className="products-list">
              {currentProducts.map((product) => (
                <ProductCard product={product} key={product.ProductID} />
              ))}
            </div>
          </div>
          <div className="filters-options"></div>
            <div className="filters" onClick={() => setFilterVisible(!FilterVisible)}>
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
