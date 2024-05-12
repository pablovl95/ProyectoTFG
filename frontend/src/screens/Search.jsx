import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productCard'; // Asumiendo que tienes un componente ProductCard para mostrar cada producto
import './css/Search.css';
import { IconAdjustmentsAlt } from '@tabler/icons-react';

const Search = () => {
  const products = // products.json
    [
      {
        "id": 1,
        "imagen": "https://rodaleinstitute.org/wp-content/uploads/Apples-2-600x400.jpg",
        "nombre": "Organic Apple",
        "categoria": "Fruit",
        "precio": "2.99",
        "calification": "4"
      },
      {
        "id": 2,
        "imagen": "https://chiquitabrands.com/wp-content/uploads/2019/08/Organics2.jpg",
        "nombre": "Organic Banana",
        "categoria": "Fruit",
        "precio": "1.99",
        "calification": "5"
      },
      {
        "id": 3,
        "imagen": "https://tamarorganics.co.uk/wp-content/uploads/2017/11/Carrot-Oxhella-3.jpg",
        "nombre": "Organic Carrot",
        "categoria": "Vegetable",
        "precio": "0.99",
        "calification": "3"
      }, {
        "id": 5,
        "imagen": "https://www.theorangefarmer.com/wp-content/uploads/2022/10/naranja.jpg",
        "nombre": "Organic Orange",
        "categoria": "Fruit",
        "precio": "2.49",
        "calification": "4"
      },
      {
        "id": 4,
        "imagen": "https://attra.ncat.org/wp-content/uploads/2022/04/tomato.jpg",
        "nombre": "Organic Tomato",
        "categoria": "Vegetable",
        "precio": "1.49",
        "calification": "4"
      },
      {
        "id": 7,
        "imagen": "https://img.huffingtonpost.es/files/image_720_480/uploads/2024/03/06/imagen-de-archivo-de-fresas-en-una-fruteria.jpeg",
        "nombre": "Organic Strawberry",
        "categoria": "Fruit",
        "precio": "3.99",
        "calification": "4"
      },


      {
        "id": 6,
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ75HOLIAoxrXWXtCHFNzkwE0a2kUVwouYWnHlntkwcyQ&s",
        "nombre": "Organic Spinach",
        "categoria": "Vegetable",
        "precio": "1.99",
        "calification": "5"
      },
      {
        "id": 8,
        "imagen": "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
        "nombre": "Organic Broccoli",
        "categoria": "Vegetable",
        "precio": "1.79",
        "calification": "3"
      },
      {
        "id": 9,
        "imagen": "https://fairtrasa.com/wp-content/uploads/pineapple-bg.jpg",
        "nombre": "Organic Pineapple",
        "categoria": "Fruit",
        "precio": "4.99",
        "calification": "5"
      },
      {
        "id": 10,
        "imagen": "https://www.diggers.com.au/cdn/shop/products/cucumber-double-yield-s0961_2ebf04c5-a6d1-4103-ab90-dd15c4559037_2048x.jpg?v=1637121368",
        "nombre": "Organic Cucumber",
        "categoria": "Vegetable",
        "precio": "1.29",
        "calification": "4"
      }
    ]
  const productCount = products.length;
  const [FilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const totalPages = Math.ceil(products.length / productsPerPage);

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
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);


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
