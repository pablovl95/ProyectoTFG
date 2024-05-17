import React, { useEffect, useState } from 'react';
import ProductSlider from '../components/ProductSlider';
import ProductCard from '../components/productCard';
import "./css/Home.css"; // Importa tus estilos CSS aquí
function Home() {
  const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : process.env.REACT_APP_BACKEND_URL;
const [popularProducts, setPopularProducts] = useState([]);
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/popularProducts`);
      const data = await response.json();
      console.log(data);
      setPopularProducts(data);
    } catch (error) {
      console.log(error);
    }
  }  
  fetchData();
}, []);
  const sliderList = [
    {
      "id": 1,
      "name": "slider1",
      "url": "/slider1.png"
    },
    {
      "id": 2,
      "name": "slider2",
      "url": "/slider2.png"
    },
    {
      "id": 3,
      "name": "slider3",
      "url": "/slider3.png"
    }
  ]

  return (
    <div className="HomeContainer">
      <div className="Slider">
        <ProductSlider images={sliderList} className="Slider" />
      </div> 
      <div className='data-container'>
        <h1 className="HomeTitle">
          Productos más vendidos
        </h1>
        <div className="data-container-cards">
          {popularProducts.map((product) => (
            <ProductCard key={product.ProductID} product={product} />
          ))}
      </div>
      </div>

    </div>
  );
}

export default Home;
