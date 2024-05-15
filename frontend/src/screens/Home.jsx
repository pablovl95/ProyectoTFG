import React, { useEffect, useState } from 'react';
import ProductSlider from '../components/ProductSlider';
import ProductCard from '../components/productCard';
import "./css/Home.css"; // Importa tus estilos CSS aquí
function Home() {
const [popularProducts, setPopularProducts] = useState([]);
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/popularProducts');
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
      "imagen": "/slider1.png"
    },
    {
      "id": 2,
      "name": "slider2",
      "imagen": "/slider2.png"
    },
    {
      "id": 3,
      "name": "slider3",
      "imagen": "/slider3.png"
    }
  ]

  return (
    <div className="HomeContainer">
      <div className="Slider">
        <ProductSlider sliderList={sliderList} className="Slider" />
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
