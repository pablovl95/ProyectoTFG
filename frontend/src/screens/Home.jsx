import React from 'react';
import ProductSlider from '../components/ProductSlider';

import "./css/Home.css"; // Importa tus estilos CSS aquí
function Home() {


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
      </div>

    </div>
  );
}

export default Home;
