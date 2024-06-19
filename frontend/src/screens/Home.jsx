import React, { useEffect, useState } from 'react';
import ProductSlider from '../components/ProductSlider';
import ProductCard from '../components/productCard';
import "./css/Home.css";
import { useNavigate } from 'react-router-dom';
function Home({ changeCart }) {
  const [popularProducts, setPopularProducts] = useState([]);
  const navigate = useNavigate();
  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/v1/popularProducts`);
        const data = await response.json();
        setPopularProducts(data);
      } catch (error) {

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
        <div className="home-options-container">
          <div className='home-option' style={{ backgroundColor: "#4A90E2" }} onClick={() => navigate("/next-implementations")}>
            Ofertas que se adecuan a tus gustos
          </div>
          <div className='home-option' style={{ backgroundColor: "#50E3C2" }} onClick={() => navigate("/work-with-us")}>
            Trabaja con nosotros
          </div>
        </div>
        <div className="home-options-container">
          <div className='home-option' style={{ backgroundColor: "#4A90E2" }} onClick={() => navigate("/next-implementations")}>
            Ofertas que se adecuan a tus gustos
          </div>
          <div className='home-option' style={{ backgroundColor: "#50E3C2" }} onClick={() => navigate("/work-with-us")}>
            Trabaja con nosotros
          </div>
        </div>
        <h1 className="HomeTitle">
          Productos más vendidos
        </h1>
        <div className="data-container-cards">
          {popularProducts.map((product) => (
            <ProductCard key={product.ProductID} product={product} changeCart={changeCart} />
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;
