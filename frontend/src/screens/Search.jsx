import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productCard'; // Asumiendo que tienes un componente ProductCard para mostrar cada producto
import './css/Search.css';
const Search = () => {
  const products = // products.json
    [
      {"id":1,
        "imagen": "https://rodaleinstitute.org/wp-content/uploads/Apples-2-600x400.jpg",
        "nombre": "Organic Apple",
        "categoria": "Fruit",
        "precio": "2.99",
        "calification": "4"
      },
      {"id":2,
        "imagen": "https://chiquitabrands.com/wp-content/uploads/2019/08/Organics2.jpg",
        "nombre": "Organic Banana",
        "categoria": "Fruit",
        "precio": "1.99",
        "calification": "5"
      },
      {"id":3,
        "imagen": "https://tamarorganics.co.uk/wp-content/uploads/2017/11/Carrot-Oxhella-3.jpg",
        "nombre": "Organic Carrot",
        "categoria": "Vegetable",
        "precio": "0.99",
        "calification": "3"
      },
      {"id":4,
        "imagen": "https://attra.ncat.org/wp-content/uploads/2022/04/tomato.jpg",
        "nombre": "Organic Tomato",
        "categoria": "Vegetable",
        "precio": "1.49",
        "calification": "4"
      },
      {"id":5,
        "imagen": "https://www.theorangefarmer.com/wp-content/uploads/2022/10/naranja.jpg",
        "nombre": "Organic Orange",
        "categoria": "Fruit",
        "precio": "2.49",
        "calification": "4"
      },
      {"id":6,
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ75HOLIAoxrXWXtCHFNzkwE0a2kUVwouYWnHlntkwcyQ&s",
        "nombre": "Organic Spinach",
        "categoria": "Vegetable",
        "precio": "1.99",
        "calification": "5"
      },
      {"id":7,
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr3ktjtnbb1AfVI9x0swfBcBitzw1GmcC0tQeo9d5Qmw&s",
        "nombre": "Organic Strawberry",
        "categoria": "Fruit",
        "precio": "3.99",
        "calification": "4"
      },
      {"id":8,
        "imagen": "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg",
        "nombre": "Organic Broccoli",
        "categoria": "Vegetable",
        "precio": "1.79",
        "calification": "3"
      },
      {"id":9,
        "imagen": "https://fairtrasa.com/wp-content/uploads/pineapple-bg.jpg",
        "nombre": "Organic Pineapple",
        "categoria": "Fruit",
        "precio": "4.99",
        "calification": "5"
      },
      {"id":10,
        "imagen": "https://www.diggers.com.au/cdn/shop/products/cucumber-double-yield-s0961_2ebf04c5-a6d1-4103-ab90-dd15c4559037_2048x.jpg?v=1637121368",
        "nombre": "Organic Cucumber",
        "categoria": "Vegetable",
        "precio": "1.29",
        "calification": "4"
      }
    ]
  // Estado para almacenar los filtros seleccionados
  const [filters, setFilters] = useState({
    category: '',
    priceRange: ''
  });


  // Función para aplicar filtros
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

  return (
    <div className="product-list-container">
      {/* Columna de filtros */}
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
          <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
            <option value="">Todos</option>

          </select>
        </label>
        <button onClick={applyFilters}>Aplicar filtros</button>
      </div>

      {/* Lista de productos */}
      <div className="products-list">
        {products.map((product, index) => (
          <ProductCard product={product} />
        ))}
      </div>
    </div>
  );
};

export default Search;
